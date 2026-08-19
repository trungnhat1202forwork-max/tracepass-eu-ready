import { useState } from "react";
import { CheckCircle2, FileText, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Field = {
  id: string;
  label: string;
  value: string;
  source: string;
  confidence: "Cao" | "Trung bình";
};

const fields: Field[] = [
  { id: "cotton", label: "Cotton", value: "95%", source: "Trang 1", confidence: "Cao" },
  { id: "elastane", label: "Elastane", value: "5%", source: "Trang 1", confidence: "Cao" },
  {
    id: "supplier",
    label: "Nhà cung cấp sợi",
    value: "Nam Phong Spinning Co.",
    source: "Trang 1",
    confidence: "Cao",
  },
  {
    id: "country",
    label: "Quốc gia sản xuất vải",
    value: "Việt Nam",
    source: "Trang 2",
    confidence: "Trung bình",
  },
  { id: "weight", label: "Định lượng vải", value: "180 g/m²", source: "Trang 2", confidence: "Cao" },
];

export function AiReviewStep({ onNext }: { onNext: () => void }) {
  const [confirmed, setConfirmed] = useState<string[]>([]);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <FileText className="size-4 text-muted-foreground" aria-hidden />
          <span className="text-[14.5px] font-semibold">Composition_Sheet_TS001.pdf</span>
        </div>
        <div className="bg-muted/50 p-5">
          <div className="mx-auto aspect-[3/4] w-full max-w-[320px] rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Composition Sheet
            </p>
            <p className="mt-2 text-[15px] font-bold">Cotton Basic T-shirt</p>
            <p className="text-[12px] text-muted-foreground">TS-COT-001 · BATCH-0826</p>
            <div className="mt-5 space-y-2.5">
              {[
                ["Cotton", "95%"],
                ["Elastane", "5%"],
                ["Định lượng", "180 g/m²"],
                ["Nhà cung cấp", "Nam Phong Spinning"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-dashed border-border pb-1.5 text-[12.5px]"
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-1.5">
              {[92, 78, 85, 60].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
              ))}
            </div>
            <p className="mt-8 text-[11px] text-muted-foreground">Trang 1 / 2</p>
          </div>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-[19px] font-semibold">Dữ liệu trích xuất</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dữ liệu do AI đọc và chuẩn hóa từ hồ sơ. Kết quả cần nhân sự phụ trách xác nhận.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Trường dữ liệu</th>
                <th className="px-4 py-3 font-semibold">Giá trị AI</th>
                <th className="px-4 py-3 font-semibold">Nguồn</th>
                <th className="px-4 py-3 font-semibold">Độ tin cậy</th>
                <th className="px-6 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => {
                const done = confirmed.includes(f.id);
                return (
                  <tr key={f.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-6 py-3 font-semibold">{f.label}</td>
                    <td className="px-4 py-3">{f.value}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.source}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[13px] font-medium",
                          f.confidence === "Cao"
                            ? "border-emerald/25 bg-emerald-soft text-emerald"
                            : "border-amber/30 bg-amber-soft text-amber",
                        )}
                      >
                        {f.confidence}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {done ? (
                        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-emerald">
                          <CheckCircle2 className="size-4" />
                          Đã xác nhận
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-[13.5px]">
                          <button
                            type="button"
                            className="font-medium text-primary hover:underline"
                            onClick={() => setConfirmed((c) => [...c, f.id])}
                          >
                            Xác nhận
                          </button>
                          <button
                            type="button"
                            className="font-medium text-primary hover:underline"
                            onClick={() => toast.success(`Đang chỉnh sửa ${f.label}`)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            type="button"
                            className="font-medium text-destructive hover:underline"
                            onClick={() => toast.success(`Đã từ chối giá trị ${f.label}`)}
                          >
                            Từ chối
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Đã xác nhận {confirmed.length}/{fields.length} trường dữ liệu
          </p>
          <Button size="lg" className="h-11" onClick={onNext}>
            <PlayCircle className="size-4" />
            Xác nhận &amp; Chạy đánh giá
          </Button>
        </div>
      </div>
    </div>
  );
}