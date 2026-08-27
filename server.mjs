import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const clientDir = path.resolve(process.cwd(), "dist/client");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

let ssrModulePromise = null;
async function getSsrFetch() {
  if (!ssrModulePromise) {
    ssrModulePromise = import("./dist/server/server.js").then((m) => m.default?.fetch || m.fetch);
  }
  return ssrModulePromise;
}

const server = http.createServer(async (req, res) => {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`;
    const url = new URL(req.url || "/", `${protocol}://${host}`);
    const pathname = decodeURIComponent(url.pathname);

    // 1. Try static asset
    if (pathname !== "/" && pathname !== "") {
      const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
      const filePath = path.join(clientDir, safePath);

      if (filePath.startsWith(clientDir)) {
        try {
          const stat = await fs.promises.stat(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || "application/octet-stream";
            res.writeHead(200, {
              "Content-Type": contentType,
              "Content-Length": stat.size,
              "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
            });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        } catch {
          // File not found -> fall through to SSR
        }
      }
    }

    // 2. SSR Handler
    const ssrFetch = await getSsrFetch();
    if (ssrFetch) {
      // Build web standard Request
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }

      const hasBody = req.method !== "GET" && req.method !== "HEAD";
      const request = new Request(url.toString(), {
        method: req.method,
        headers,
        body: hasBody ? Readable.toWeb(req) : undefined,
        // @ts-expect-error Node duplex option
        duplex: hasBody ? "half" : undefined,
      });

      const response = await ssrFetch(request);

      // Send response back
      const resHeaders = {};
      response.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      res.writeHead(response.status, response.statusText, resHeaders);

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  } catch (err) {
    console.error("Request handler error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
    }
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`TRACEPASS server listening on http://${HOST}:${PORT}`);
});
