import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { ReadinessBadge } from "@/components/tracepass/StatusBadge";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/tracepass/data";

export const Route = createFileRoute("/san-pham/")({
  head: () => ({
    meta: [
      { title: "Danh mục sản phẩm | TRACEPASS" },
      {
        name: "description",
        content: "Quản lý danh mục sản phẩm dệt may và mức độ sẵn sàng cho thị trường EU.",
      },
      { property: "og:title", content: "Danh mục sản phẩm | TRACEPASS" },
      {
        property: "og:description",
        content: "Danh mục sản phẩm dệt may và mức độ sẵn sàng cho thị trường EU.",
      },
    ],
  }),
  component: ProductList,
});

function ProductList() {
  return (
    <AppShell>
      <PageHeader
        title="Sản phẩm"
        description="Mỗi sản phẩm là trung tâm của hồ sơ, đánh giá, DPP và cảnh báo."
        action={
          <Button asChild size="lg" className="h-11">
            <Link to="/san-pham/moi">
              <Plus className="size-4" />
              Tạo sản phẩm
            </Link>
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            to="/san-pham/$id"
            params={{ id: p.id }}
            className="surface-card overflow-hidden transition-shadow hover:shadow-[var(--shadow-raised)]"
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              width={400}
              height={200}
              className="h-44 w-full object-cover"
            />
            <div className="space-y-2 p-5">
              <h2 className="text-[18px] font-semibold">{p.name}</h2>
              <p className="text-sm text-muted-foreground">
                {p.sku} · {p.batch} · {p.market} / {p.country}
              </p>
              <div className="flex items-center justify-between pt-1">
                <ReadinessBadge status={p.readiness} />
                <span className="text-[13px] text-muted-foreground">DPP: {p.dpp}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}