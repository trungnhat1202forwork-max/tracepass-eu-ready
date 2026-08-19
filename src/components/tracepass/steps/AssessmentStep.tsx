import { useState } from "react";
import { RefreshCw, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReadinessBadge } from "@/components/tracepass/StatusBadge";
import { readinessLabel, requirements, type Requirement } from "@/lib/tracepass/data";
import { setAppState, useAppState } from "@/lib/tracepass/store";
import { cn } from "@/lib/utils";

export function AssessmentStep({ onNext }: { onNext: () => void }) {
  const { issuesResolved } = useAppState();
  const [selected, setSelected] = useState<Requirement | null>(null);

  const rows: Requirement[] = requirements.map((r) =>
    issuesResolved && r.status !== "ready"
      ? {
          ...r,
          status: "ready",
          evidence:
            r.id === "chemical" ? "Lab_Report_TS001.pdf — Trang 1" : `${r.evidence} (đã cập nhật)`,
          issue: "Không có vấn đề",
          action: "Không cần hành động",
        }
      : r,
  );

  const counts = {
    ready: rows.filter((r) => r.status === "ready").length,
    action: rows.filter((r) => r.status === "action").length,
    review: rows.filter((r) => r.status === "review").length,
    critical: rows.filter((r) => r.status === "critical").length,
  };
  const overall = issuesResolved ? "ready" : "action";

  return (
    <div className="flex flex-col gap-6">
      <div className="surface-card flex flex-wrap items-center justify-between gap-6 p-6">
        <div>
          <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            Trạng thái tổng thể
          </p>
          <p
            className={cn(
              "mt-1.5 text-[32px] leading-none font-bold uppercase",
              overall === "ready" ? "text-emerald" : "text-amber",
            )}
          >
            {readinessLabel[overall]}
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Kết quả từ Rule Engine dựa trên dữ liệu, bằng chứng và bộ quy tắc áp dụng cho thị trường
            EU.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {(["ready", "action", "review", "critical"] as const).map((k) => (
            <div key={k} className="rounded-lg border border-border px-4 py-3 text-center">
              <p className="text-2xl font-bold">{counts[k]}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{readinessLabel[k]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-[14px]">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Yêu cầu</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Bằng chứng</th>
                <th className="px-4 py-3 font-semibold">Vấn đề</th>
                <th className="px-6 py-3 font-semibold">Hành động đề xuất</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer border-t border-border hover:bg-muted/40"
                >
                  <td className="px-6 py-3">
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block text-[13px] text-muted-foreground">{r.legal}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ReadinessBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.evidence}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.issue}</td>
                  <td className="px-6 py-3 text-muted-foreground">{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setAppState({ issuesResolved: true });
              toast.success("Đã xử lý các vấn đề tồn đọng");
            }}
          >
            <Wrench className="size-4" />
            Xử lý vấn đề
          </Button>
          <Button variant="ghost" onClick={() => toast.success("Đã chạy lại đánh giá")}>
            <RefreshCw className="size-4" />
            Chạy lại đánh giá
          </Button>
        </div>
        <Button size="lg" className="h-11" onClick={onNext} disabled={!issuesResolved}>
          Tạo DPP
        </Button>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-[20px]">{selected.name}</SheetTitle>
                <SheetDescription>Chi tiết kết quả kiểm tra của Rule Engine.</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8">
                <ReadinessBadge status={selected.status} />
                {[
                  ["Yêu cầu", selected.name],
                  ["Mã quy tắc", selected.ruleId],
                  ["Nguồn pháp lý", selected.legal],
                  ["Bằng chứng", selected.evidence],
                  ["Vấn đề", selected.issue],
                  ["Hành động đề xuất", selected.action],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {k}
                    </p>
                    <p className="mt-1 text-[15px]">{v}</p>
                  </div>
                ))}
                <Button
                  className="w-full"
                  onClick={() => {
                    setAppState({ issuesResolved: true });
                    setSelected(null);
                    toast.success("Đã xử lý vấn đề");
                  }}
                >
                  Xử lý vấn đề
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}