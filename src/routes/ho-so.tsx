import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { DocStatusBadge, RequirementBadge } from "@/components/tracepass/StatusBadge";
import { Button } from "@/components/ui/button";
import { checklist, mainProduct } from "@/lib/tracepass/data";

export const Route = createFileRoute("/ho-so")({
  head: () => ({
    meta: [
      { title: "Hồ sơ tuân thủ | TRACEPASS" },
      {
        name: "description",
        content: "Danh mục hồ sơ bắt buộc theo sản phẩm, nguồn pháp lý và trạng thái xử lý.",
      },
      { property: "og:title", content: "Hồ sơ tuân thủ | TRACEPASS" },
      {
        property: "og:description",
        content: "Danh mục hồ sơ theo sản phẩm, nguồn pháp lý và trạng thái xử lý.",
      },
    ],
  }),
  component: Documents,
});

function Documents() {
  return (
    <AppShell>
      <PageHeader
        title="Hồ sơ"
        description={`${mainProduct.name} · ${mainProduct.market} / ${mainProduct.country} · ${mainProduct.batch}`}
        action={
          <Button asChild size="lg" className="h-11">
            <Link
              to="/san-pham/$id"
              params={{ id: mainProduct.id }}
              search={{ buoc: "ho-so" as const }}
            >
              Tiếp tục tải hồ sơ
            </Link>
          </Button>
        }
      />

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[14px]">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Hồ sơ</th>
                <th className="px-4 py-3 font-semibold">Yêu cầu</th>
                <th className="px-4 py-3 font-semibold">Nguồn pháp lý</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-6 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-6 py-3 font-semibold">{row.doc}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.requirement}</td>
                  <td className="px-4 py-3">
                    <span className="block">{row.legal}</span>
                    <span className="mt-1 inline-block">
                      <RequirementBadge kind={row.badge} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DocStatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      to="/san-pham/$id"
                      params={{ id: mainProduct.id }}
                      search={{ buoc: "ho-so" as const }}
                      className="font-medium text-primary hover:underline"
                    >
                      Mở hồ sơ
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}