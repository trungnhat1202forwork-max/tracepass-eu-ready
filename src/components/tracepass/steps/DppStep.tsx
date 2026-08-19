import { useNavigate } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DppSection, dppSections, evidenceItems } from "@/components/tracepass/DppContent";
import { RequirementBadge } from "@/components/tracepass/StatusBadge";
import { mainProduct } from "@/lib/tracepass/data";
import { setAppState } from "@/lib/tracepass/store";

export function DppStep() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="surface-card overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <img
            src={mainProduct.image}
            alt={mainProduct.name}
            width={420}
            height={320}
            className="h-full max-h-[320px] w-full object-cover"
          />
          <div className="flex flex-col justify-center gap-3 p-7">
            <div className="flex flex-wrap items-center gap-2">
              <RequirementBadge kind="dpp" />
              <span className="rounded-full border border-emerald/25 bg-emerald-soft px-2.5 py-1 text-[13px] font-medium text-emerald">
                Sẵn sàng
              </span>
            </div>
            <h2 className="text-[30px] leading-tight font-bold">{mainProduct.name}</h2>
            <p className="text-[15px] text-muted-foreground">
              Product ID {mainProduct.productId} · DPP v1.0
            </p>
            <p className="max-w-lg text-[15px] text-muted-foreground">
              Hồ sơ nhận dạng số của sản phẩm, tổng hợp dữ liệu vật liệu, sản xuất, chuỗi cung ứng
              và bằng chứng đã xác nhận.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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

      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
        <p className="text-[13.5px] text-muted-foreground">
          Bản thử nghiệm TRACEPASS — Chưa đăng ký với EU Registry
        </p>
        <Button
          size="lg"
          className="h-11"
          onClick={() => {
            setAppState({ dppPublished: true });
            navigate({ to: "/dpp/qr" });
          }}
        >
          <QrCode className="size-4" />
          Công bố &amp; Tạo QR
        </Button>
      </div>
    </div>
  );
}