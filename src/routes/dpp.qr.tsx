import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { QrVisual } from "@/components/tracepass/QrVisual";
import { Button } from "@/components/ui/button";
import { mainProduct } from "@/lib/tracepass/data";

export const Route = createFileRoute("/dpp/qr")({
  head: () => ({
    meta: [
      { title: "QR & trang DPP công khai | TRACEPASS" },
      {
        name: "description",
        content: "Mã QR và đường dẫn công khai cho Digital Product Passport của sản phẩm.",
      },
      { property: "og:title", content: "QR & trang DPP công khai | TRACEPASS" },
      {
        property: "og:description",
        content: "Mã QR và đường dẫn công khai cho DPP của sản phẩm.",
      },
    ],
  }),
  component: QrPage,
});

function QrPage() {
  const publicUrl = `https://dpp.tracepass.io/p/${mainProduct.productId}`;

  return (
    <AppShell>
      <PageHeader
        title="QR & trang công khai"
        description="Chia sẻ hồ sơ nhận dạng số của sản phẩm tới đối tác và người tiêu dùng."
      />

      <div className="grid max-w-4xl gap-6 md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="surface-card flex flex-col items-center p-6">
          <QrVisual className="size-[220px]" />
          <p className="mt-4 text-[14px] font-semibold">{mainProduct.productId}</p>
          <p className="text-[13px] text-muted-foreground">DPP v1.0</p>
        </div>

        <div className="surface-card flex flex-col gap-4 p-6">
          <div>
            <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
              Đường dẫn công khai
            </p>
            <p className="mt-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-[14.5px] break-all">
              {publicUrl}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11">
              <Link to="/dpp/cong-khai/$id" params={{ id: mainProduct.productId }}>
                <ExternalLink className="size-4" />
                Xem trang công khai
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                void navigator.clipboard?.writeText(publicUrl);
                toast.success("Đã sao chép đường dẫn");
              }}
            >
              <Copy className="size-4" />
              Copy link
            </Button>
            <Button variant="ghost" onClick={() => toast.success("Đã tải mã QR")}>
              <Download className="size-4" />
              Tải QR
            </Button>
          </div>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Bản thử nghiệm TRACEPASS — Chưa đăng ký với EU Registry
          </p>
        </div>
      </div>
    </AppShell>
  );
}