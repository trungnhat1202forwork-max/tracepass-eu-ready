import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/tracepass/AppShell";
import { AlertStatusBadge } from "@/components/tracepass/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { alerts, type AlertItem } from "@/lib/tracepass/data";

export const Route = createFileRoute("/theo-doi")({
  head: () => ({
    meta: [
      { title: "Theo dõi & cảnh báo | TRACEPASS" },
      {
        name: "description",
        content: "Theo dõi hạn hiệu lực hồ sơ, chứng nhận và yêu cầu cập nhật DPP.",
      },
      { property: "og:title", content: "Theo dõi & cảnh báo | TRACEPASS" },
      {
        property: "og:description",
        content: "Hạn hiệu lực hồ sơ, chứng nhận và yêu cầu cập nhật DPP.",
      },
    ],
  }),
  component: Monitoring,
});

function Monitoring() {
  const [selected, setSelected] = useState<AlertItem | null>(null);

  return (
    <AppShell>
      <PageHeader
        title="Theo dõi"
        description="Cảnh báo gắn với sản phẩm và hồ sơ tương ứng, cập nhật theo hạn hiệu lực."
      />

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[14px]">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Hạng mục</th>
                <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                <th className="px-4 py-3 font-semibold">Hạn cập nhật</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-6 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="cursor-pointer border-t border-border hover:bg-muted/40"
                >
                  <td className="px-6 py-3">
                    <span className="block font-semibold">{a.item}</span>
                    <span className="block text-[13px] text-muted-foreground">{a.legal}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.productSku}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.due}</td>
                  <td className="px-4 py-3">
                    <AlertStatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-medium text-primary hover:underline">Xem chi tiết</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-[20px]">{selected.item}</SheetTitle>
                <SheetDescription>{selected.productSku}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8">
                <AlertStatusBadge status={selected.status} />
                {[
                  ["Hạn cập nhật", selected.due],
                  ["Nguồn pháp lý", selected.legal],
                  ["Nội dung", selected.detail],
                  ["Hành động đề xuất", selected.action],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {k}
                    </p>
                    <p className="mt-1 text-[15px]">{v}</p>
                  </div>
                ))}
                <Button asChild className="w-full">
                  <Link
                    to="/san-pham/$id"
                    params={{ id: selected.productId }}
                    search={{ buoc: selected.item === "DPP" ? "dpp" : "ho-so" }}
                  >
                    Mở sản phẩm
                  </Link>
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}