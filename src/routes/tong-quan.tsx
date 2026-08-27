import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { AlertStatusBadge, ReadinessBadge } from "@/components/tracepass/StatusBadge";
import { Button } from "@/components/ui/button";
import { alerts, dashboardStats, documentStats, products } from "@/lib/tracepass/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tong-quan")({
  head: () => ({
    meta: [
      { title: "Tổng quan tuân thủ | TRACEPASS" },
      {
        name: "description",
        content:
          "Theo dõi mức độ sẵn sàng sản phẩm, hồ sơ và cảnh báo cho thị trường EU trên TRACEPASS.",
      },
      { property: "og:title", content: "Tổng quan tuân thủ | TRACEPASS" },
      {
        property: "og:description",
        content: "Mức độ sẵn sàng sản phẩm, hồ sơ và cảnh báo cho thị trường EU.",
      },
    ],
  }),
  component: Dashboard,
});

const statCards = [
  { label: "Tổng sản phẩm", value: dashboardStats.totalProducts, tone: "text-foreground" },
  { label: "Sẵn sàng", value: dashboardStats.ready, tone: "text-emerald" },
  { label: "Cần hành động", value: dashboardStats.action, tone: "text-amber" },
  { label: "Cần xem lại", value: dashboardStats.review, tone: "text-info" },
];

const toneClass = {
  amber: "text-amber",
  danger: "text-destructive",
  info: "text-info",
} as const;

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Tổng quan"
        description="Trạng thái dữ liệu tuân thủ của Vision Textile JSC cho thị trường EU."
        action={
          <Button asChild size="lg" className="h-11">
            <Link to="/san-pham/moi">
              <Plus className="size-4" />
              Tạo sản phẩm
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((c) => (
          <div key={c.label} className="surface-card p-5">
            <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
            <p className={cn("mt-2 text-[34px] leading-none font-bold", c.tone)}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-[19px] font-semibold">Sản phẩm gần đây</h2>
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Xem tất cả <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <table className="w-full text-[14px]">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Sản phẩm</th>
                <th className="px-4 py-3 font-semibold">Thị trường</th>
                <th className="px-4 py-3 font-semibold">Mức độ sẵn sàng</th>
                <th className="px-6 py-3 font-semibold">DPP</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border transition-colors hover:bg-muted/40"
                >
                  <td className="px-6 py-3">
                    <Link
                      to="/san-pham/$id"
                      params={{ id: p.id }}
                      search={{ buoc: "thiet-lap" as const }}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={44}
                        height={44}
                        className="size-11 rounded-lg border border-border object-cover"
                      />
                      <span>
                        <span className="block font-semibold text-foreground">{p.name}</span>
                        <span className="block text-[13px] text-muted-foreground">
                          {p.sku} · {p.batch}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.market} · {p.country}
                  </td>
                  <td className="px-4 py-3">
                    <ReadinessBadge status={p.readiness} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{p.dpp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-6">
          <div className="surface-card p-6">
            <h2 className="text-[19px] font-semibold">Hồ sơ</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {documentStats.map((d) => (
                <Link
                  key={d.label}
                  to="/ho-so"
                  className="rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/50"
                >
                  <p className={cn("text-2xl font-bold", toneClass[d.tone])}>{d.value}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{d.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-[19px] font-semibold">Cảnh báo gần đây</h2>
              <Link to="/theo-doi" className="text-sm font-medium text-primary hover:underline">
                Theo dõi
              </Link>
            </div>
            <ul>
              {alerts.slice(0, 5).map((a) => (
                <li key={a.id} className="border-t border-border first:border-t-0">
                  <Link
                    to="/san-pham/$id"
                    params={{ id: a.productId }}
                    search={{ buoc: a.item === "DPP" ? "dpp" : "ho-so" }}
                    className="flex items-start justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-muted/40"
                  >
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold">{a.item}</span>
                      <span className="block text-[13px] text-muted-foreground">
                        {a.productSku} · {a.due}
                      </span>
                    </span>
                    <AlertStatusBadge status={a.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
