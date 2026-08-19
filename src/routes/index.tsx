import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRACEPASS — Chuẩn hóa dữ liệu cho thị trường EU" },
      {
        name: "description",
        content:
          "TRACEPASS giúp doanh nghiệp dệt may chuẩn hóa hồ sơ, đánh giá mức độ sẵn sàng và tạo DPP cho thị trường EU.",
      },
      { property: "og:title", content: "TRACEPASS — ToLocal, GoGlobal" },
      {
        property: "og:description",
        content: "Chuẩn hóa dữ liệu. Sẵn sàng cho thị trường EU.",
      },
    ],
  }),
  component: Splash,
});

const NODE_ANGLES = [0, 72, 144, 216, 288];

function Splash() {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[image:var(--gradient-surface)] px-6">
      <div className="relative flex size-[340px] items-center justify-center">
        <svg viewBox="0 0 340 340" className="absolute inset-0 size-full" aria-hidden>
          <g className="tp-orbit">
            <circle
              cx="170"
              cy="170"
              r="150"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.18"
              strokeWidth="1.5"
            />
            <circle
              cx="170"
              cy="170"
              r="150"
              fill="none"
              stroke="var(--emerald)"
              strokeOpacity="0.55"
              strokeWidth="2.5"
              strokeDasharray="120 822"
              strokeLinecap="round"
            />
            {NODE_ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={angle}
                  cx={170 + 150 * Math.cos(rad)}
                  cy={170 + 150 * Math.sin(rad)}
                  r="4"
                  className="tp-node"
                  fill={i % 2 === 0 ? "var(--primary)" : "var(--emerald)"}
                  style={{ animationDelay: `${i * 0.7}s` }}
                />
              );
            })}
          </g>
        </svg>

        <div className="tp-logo-core relative flex size-[188px] items-center justify-center">
          {logoOk ? (
            <img
              src="/tracepass-logo.png"
              alt="TRACEPASS"
              width={188}
              height={188}
              className="size-full object-contain"
              onError={() => setLogoOk(false)}
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center rounded-3xl border border-border bg-card shadow-[var(--shadow-raised)]">
              <span className="text-[26px] font-extrabold tracking-tight text-primary">TRACE</span>
              <span className="text-[26px] font-extrabold tracking-tight text-emerald">PASS</span>
            </div>
          )}
        </div>
      </div>

      <div className="tp-fade-up mt-6 text-center" style={{ animationDelay: "0.9s" }}>
        <p className="text-[22px] font-semibold tracking-tight text-primary">ToLocal, GoGlobal</p>
        <p className="mt-2 text-[16px] text-muted-foreground">
          Chuẩn hóa dữ liệu. Sẵn sàng cho thị trường EU.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 px-8 text-[15px]">
          <Link to="/tong-quan">
            Bắt đầu
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
