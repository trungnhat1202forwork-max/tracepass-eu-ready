import { Button } from "@/components/ui/button";
import { RequirementBadge } from "@/components/tracepass/StatusBadge";
import { COMPANY, type Product } from "@/lib/tracepass/data";

export function SetupStep({ product, onNext }: { product: Product; onNext: () => void }) {
  const fields = [
    { label: "Tên sản phẩm", value: product.name },
    { label: "SKU / Mã kiểu", value: product.sku },
    { label: "Danh mục", value: product.category },
    { label: "Lô sản xuất", value: product.batch },
    { label: "Thị trường", value: product.market },
    { label: "Quốc gia mục tiêu", value: product.country },
    { label: "Product ID", value: product.productId },
    { label: "Thành phần vật liệu", value: product.material },
    { label: "Doanh nghiệp", value: COMPANY },
    { label: "GTIN", value: "Chưa có dữ liệu" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="surface-card p-6">
        <h2 className="text-[19px] font-semibold">Thông tin thiết lập</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="text-[13px] font-medium tracking-wide text-muted-foreground uppercase">
                {f.label}
              </dt>
              <dd className="mt-1 text-[15.5px] font-semibold text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-6">
        <div className="surface-card p-6">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={320}
            height={220}
            className="h-44 w-full rounded-lg border border-border object-cover"
          />
          <p className="mt-4 text-[15px] font-semibold">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            {product.sku} · {product.batch}
          </p>
        </div>
        <div className="surface-card p-6">
          <h3 className="text-[15px] font-semibold">Phạm vi yêu cầu</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <RequirementBadge kind="current" />
            <RequirementBadge kind="dpp" />
            <RequirementBadge kind="future" />
            <RequirementBadge kind="prep" />
          </div>
        </div>
        <Button size="lg" className="h-11" onClick={onNext}>
          Tiếp tục tải hồ sơ
        </Button>
      </div>
    </div>
  );
}
