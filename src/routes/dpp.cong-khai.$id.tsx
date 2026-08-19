import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Brandmark } from "@/components/tracepass/Brandmark";
import { DppSection, dppSections, evidenceItems } from "@/components/tracepass/DppContent";
import { QrVisual } from "@/components/tracepass/QrVisual";
import { RequirementBadge } from "@/components/tracepass/StatusBadge";
import { mainProduct, products } from "@/lib/tracepass/data";

export const Route = createFileRoute("/dpp/cong-khai/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `DPP công khai — ${params.id} | TRACEPASS` },
      {
        name: "description",
        content: "Digital Product Passport công khai — dữ liệu vật liệu, sản xuất và bằng chứng.",
      },
      { property: "og:title", content: `DPP công khai — ${params.id} | TRACEPASS` },
      {
        property: "og:description",
        content: "Digital Product Passport công khai cho thị trường EU.",
      },
    ],
  }),
  component: PublicDppPage,
});

function PublicDppPage() {
  const { id } = Route.useParams();
  const product = products.find((p) => p.productId === id) ?? mainProduct;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <Brandmark className="size-8" />
            <span className="text-[15px] font-bold tracking-tight">TRACEPASS</span>
          </Link>
          <span className="text-[13px] text-muted-foreground">DPP công khai</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] px-6 py-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <RequirementBadge kind="dpp" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald-soft px-2.5 py-1 text-[13px] font-medium text-emerald">
            <ShieldCheck className="size-3.5" aria-hidden />
            Đã xác thực bởi TRACEPASS
          </span>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="grid md:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
            <img
              src={product.image}
              alt={product.name}
              width={380}
              height={300}
              className="h-full max-h-[300px] w-full object-cover"
            />
            <div className="flex flex-col justify-center gap-3 p-7">
              <h1 className="text-[28px] leading-tight font-bold">{product.name}</h1>
              <p className="text-[15px] text-muted-foreground">
                Product ID {product.productId} · DPP v1.0
              </p>
              <p className="text-[13.5px] text-muted-foreground">
                Bản thử nghiệm TRACEPASS — Chưa đăng ký với EU Registry
              </p>
              <div className="mt-2 flex items-center gap-3">
                <QrVisual className="size-16 shrink-0" />
                <p className="text-[12.5px] text-muted-foreground">
                  Quét mã để mở lại trang này trên thiết bị khác.
                </p>
              </div>
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

        <p className="mt-8 text-center text-[13px] text-muted-foreground">
          Trang này được tạo bởi{" "}
          <Link to="/" className="font-medium text-primary hover:underline">
            TRACEPASS
          </Link>{" "}
          — nền tảng chuẩn hóa dữ liệu cho thị trường EU.
        </p>
      </main>
    </div>
  );
}
