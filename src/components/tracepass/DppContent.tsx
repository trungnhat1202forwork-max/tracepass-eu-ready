import type { ReactNode } from "react";
import { mainProduct } from "@/lib/tracepass/data";

export function DppSection({
  title,
  rows,
  children,
}: {
  title: string;
  rows?: [string, string][];
  children?: ReactNode;
}) {
  return (
    <section className="surface-card p-6">
      <h3 className="text-[18px] font-semibold">{title}</h3>
      {rows ? (
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] font-medium tracking-wide text-muted-foreground uppercase">
                {k}
              </dt>
              <dd className="mt-1 text-[15.5px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {children}
    </section>
  );
}

const p = mainProduct;

export const dppSections: { title: string; rows: [string, string][] }[] = [
  {
    title: "Sản phẩm",
    rows: [
      ["Tên sản phẩm", p.name],
      ["SKU", p.sku],
      ["Product ID", p.productId],
      ["Lô sản xuất", p.batch],
      ["Danh mục", p.category],
      ["Thị trường", `${p.market} · ${p.country}`],
    ],
  },
  {
    title: "Vật liệu",
    rows: [
      ["Thành phần sợi", p.material],
      ["Định lượng vải", "180 g/m²"],
      ["Nhuộm & hoàn tất", "Nhuộm phản ứng, không chất bị hạn chế"],
      ["Tỷ lệ vật liệu tái chế", "Chưa có dữ liệu"],
    ],
  },
  {
    title: "Sản xuất",
    rows: [
      ["Nhà sản xuất", "Vision Textile JSC"],
      ["Nhà máy may", "Vision Textile — Nhà máy Hưng Yên"],
      ["Quốc gia sản xuất", "Việt Nam"],
      ["Năm sản xuất", "2026"],
    ],
  },
  {
    title: "Chuỗi cung ứng",
    rows: [
      ["Kéo sợi", "Nam Phong Spinning Co. — Việt Nam"],
      ["Dệt vải", "An Thịnh Knitting — Việt Nam"],
      ["Nhuộm & hoàn tất", "Green Dyeing Works — Việt Nam"],
      ["Nhà nhập khẩu EU", "Chưa có dữ liệu"],
    ],
  },
  {
    title: "Hướng dẫn chăm sóc",
    rows: [
      ["Giặt", "Giặt máy tối đa 30°C, chu trình nhẹ"],
      ["Tẩy", "Không sử dụng chất tẩy"],
      ["Sấy", "Không sấy khô bằng máy"],
      ["Là ủi", "Là ở nhiệt độ thấp, tối đa 110°C"],
    ],
  },
  {
    title: "Bền vững",
    rows: [
      ["Khả năng tái chế", "Có thể tái chế theo dòng vật liệu cotton pha"],
      ["Hướng dẫn thải bỏ", "Chuyển đến điểm thu gom dệt may"],
      ["Dấu chân carbon", "Chưa có dữ liệu"],
      ["Tiêu thụ nước", "Chưa có dữ liệu"],
    ],
  },
];

export const evidenceItems = [
  { name: "Composition Sheet", legal: "Regulation (EU) No 1007/2011", state: "Đã xác nhận" },
  { name: "Lab Report", legal: "REACH Annex XVII", state: "Đã xác nhận" },
  { name: "Certificate", legal: "ESPR", state: "Đã xác nhận" },
  { name: "Supplier Declaration", legal: "Regulation (EU) No 1007/2011", state: "Đã xác nhận" },
];
