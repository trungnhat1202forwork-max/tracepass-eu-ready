import { useState } from "react";
import { FileText, Sparkles, Trash2, Upload, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DocStatusBadge, RequirementBadge } from "@/components/tracepass/StatusBadge";
import { checklist, uploadDocs } from "@/lib/tracepass/data";
import { setAppState, useAppState } from "@/lib/tracepass/store";

export function DocsStep({ onNext }: { onNext: () => void }) {
  const { aiProcessed } = useAppState();
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  function runAi() {
    if (processing) return;
    setProcessing(true);
    setProgress(8);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setProcessing(false);
          setAppState({ aiProcessed: true });
          onNext();
          return 100;
        }
        return p + 12;
      });
    }, 180);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-[19px] font-semibold">Checklist hồ sơ</h2>
        </div>
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
                    <span className="block text-foreground">{row.legal}</span>
                    <span className="mt-1 inline-block">
                      <RequirementBadge kind={row.badge} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DocStatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(
                          row.status === "missing"
                            ? `Đã mở khung tải lên cho ${row.doc}`
                            : `Đã mở ${row.doc}`,
                        )
                      }
                      className="font-medium text-primary hover:underline"
                    >
                      {row.status === "missing" ? "Tải lên" : "Xem"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="surface-card flex flex-col items-center justify-center border-dashed p-8 text-center">
          <UploadCloud className="size-9 text-primary" aria-hidden />
          <p className="mt-3 text-[15.5px] font-semibold">Kéo và thả hồ sơ vào đây</p>
          <p className="mt-1 text-sm text-muted-foreground">Hỗ trợ PDF, JPG, PNG · tối đa 25 MB</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => toast.success("Đã chọn tệp để tải lên")}
          >
            <Upload className="size-4" />
            Chọn tệp
          </Button>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-[19px] font-semibold">Danh sách hồ sơ</h2>
          </div>
          <ul>
            {uploadDocs.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3.5 first:border-t-0"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-semibold">{d.name}</span>
                    <span className="block text-[13px] text-muted-foreground">{d.size}</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <DocStatusBadge status={d.status} />
                  <span className="flex items-center gap-2 text-[13.5px]">
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => toast.success("Đã tải lên hồ sơ")}
                    >
                      Tải lên
                    </button>
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => toast.success("Đã thay thế hồ sơ")}
                    >
                      Thay thế
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-medium text-destructive hover:underline"
                      onClick={() => toast.success("Đã xóa hồ sơ")}
                    >
                      <Trash2 className="size-3.5" />
                      Xóa
                    </button>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
        {processing ? (
          <div className="min-w-[280px] flex-1">
            <p className="text-[15px] font-semibold">AI đang xử lý hồ sơ...</p>
            <Progress value={progress} className="mt-3 h-2" />
          </div>
        ) : (
          <p className="text-[15px] text-muted-foreground">
            {aiProcessed
              ? "Dữ liệu đã được trích xuất và chờ xác nhận."
              : "Hồ sơ sẵn sàng để trích xuất dữ liệu."}
          </p>
        )}
        <Button size="lg" className="h-11" onClick={aiProcessed ? onNext : runAi} disabled={processing}>
          <Sparkles className="size-4" />
          {aiProcessed ? "Xem dữ liệu trích xuất" : "Xử lý bằng AI"}
        </Button>
      </div>
    </div>
  );
}