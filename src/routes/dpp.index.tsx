import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { DppSection, dppSections, evidenceItems } from "@/components/tracepass/DppContent";
import { RequirementBadge } from "@/components/tracepass/StatusBadge";
import { Button } from "@/components/ui/button";
import { mainProduct } from "@/lib/tracepass/data";

export const Route = createFileRoute("/dpp/")({
  head: () => ({
    meta: [
      { title: "DPP Draft sản phẩm | TRACEPASS" },
      {
        name: "description",
        content: "Bản nháp Digital Product Passport với dữ liệu vật liệu, sản xuất và bằng chứng.",
      },
      { property: "og:title", content: "DPP Draft sản phẩm | TRACEPASS" },
      {
        property: "og:description",
        content: "Bản nháp DPP với dữ liệu vật liệu, sản xuất và bằng chứng đã xác nhận.",
      },
    ],
  }),
  component: DppPage,
});

function DppPage() {
  return (
    <AppShell>
      <PageHeader
        title="DPP"
        description="Hồ sơ nhận dạng số của sản phẩm, tổng hợp từ dữ liệu đã xác nhận."
        action={
          <Button asChild size="lg" className="h-11">
            <Link to="/dpp/qr">Công bố &amp; Tạo QR</Link>
          </Button>
        }
      />

      <div className="surface-card overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <img
            src={mainProduct.image}
            alt={mainProduct.name}
            width={440}
            height={320}
            className="h-full max-h-[320px] w-full object-cover"
          />
          <div className="flex flex-col justify-center gap-3 p-7">
            <div className="flex flex-wrap items-center gap-2">
              <RequirementBadge kind="dpp" />
              <RequirementBadge kind="prep" />
            </div>
            <h2 className="text-[30px] leading-tight font-bold">{mainProduct.name}</h2>
            <p className="text-[15px] text-muted-foreground">
              Product ID {mainProduct.productId} · DPP v1.0
            </p>
            <p className="text-[13.5px] text-muted-foreground">
              Bản thử nghiệm TRACEPASS — Chưa đăng ký với EU Registry
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {dppSections.map((s) => (
          <DppSection key={s.title} title={s.title} rows={s.rows} />
        ))}
        <DppSection title="Bằng chứng">
          <ul className="mt-4 divide-y divide-border">
            {evidenceItems.map((e) => (
              <li key={e.name} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <span className="block text-[15px] font-semibold">{e.name}</span>
                  <span className="block text-[13px] text-muted-foreground">{e.legal}</span>
                </span>
                <span className="text-[13.5px] font-medium text-emerald">{e.state}</span>
              </li>
            ))}
          </ul>
        </DppSection>
      </div>
    </AppShell>
  );
}