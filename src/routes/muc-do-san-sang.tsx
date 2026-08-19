import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { ReadinessBadge } from "@/components/tracepass/StatusBadge";
import { Button } from "@/components/ui/button";
import { mainProduct, products, readinessLabel, requirements } from "@/lib/tracepass/data";
import { useAppState } from "@/lib/tracepass/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/muc-do-san-sang")({
  head: () => ({
    meta: [
      { title: "Mức độ sẵn sàng | TRACEPASS" },
      {
        name: "description",
        content: "Kết quả Rule Engine theo từng yêu cầu dữ liệu và bằng chứng cho thị trường EU.",
      },
      { property: "og:title", content: "Mức độ sẵn sàng | TRACEPASS" },
      {
        property: "og:description",
        content: "Kết quả kiểm tra dữ liệu, bằng chứng và quy tắc cho thị trường EU.",
      },
    ],
  }),
  component: Readiness,
});

function Readiness() {
  const { issuesResolved } = useAppState();
  const overall = issuesResolved ? "ready" : "action";

  return (
    <AppShell>
      <PageHeader
        title="Mức độ sẵn sàng"
        description="Tổng hợp kết quả đánh giá theo sản phẩm và theo từng yêu cầu."
        action={
          <Button asChild size="lg" className="h-11">
            <Link
              to="/san-pham/$id"
              params={{ id: mainProduct.id }}
              search={{ buoc: "danh-gia" as const }}
            >
              Mở đánh giá chi tiết
            </Link>
          </Button>
        }
      />

      <div className="surface-card mb-6 flex flex-wrap items-center justify-between gap-6 p-6">
        <div>
          <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            {mainProduct.name} · {mainProduct.sku}
          </p>
          <p
            className={cn(
              "mt-1.5 text-[32px] leading-none font-bold uppercase",
              overall === "ready" ? "text-emerald" : "text-amber",
            )}
          >
            {readinessLabel[overall]}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to="/san-pham/$id"
              params={{ id: p.id }}
              search={{ buoc: "danh-gia" as const }}
              className="rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <p className="text-[14px] font-semibold">{p.sku}</p>
              <span className="mt-1.5 inline-block">
                <ReadinessBadge status={p.readiness} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[14px]">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Yêu cầu</th>
                <th className="px-4 py-3 font-semibold">Mã quy tắc</th>
                <th className="px-4 py-3 font-semibold">Nguồn pháp lý</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-6 py-3 font-semibold">Bằng chứng</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-6 py-3 font-semibold">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.ruleId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.legal}</td>
                  <td className="px-4 py-3">
                    <ReadinessBadge status={issuesResolved ? "ready" : r.status} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{r.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}