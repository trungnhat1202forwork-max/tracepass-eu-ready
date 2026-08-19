import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { key: "thiet-lap", label: "Thiết lập" },
  { key: "ho-so", label: "Hồ sơ" },
  { key: "xac-nhan", label: "Xác nhận" },
  { key: "danh-gia", label: "Đánh giá" },
  { key: "dpp", label: "DPP" },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export function Stepper({
  current,
  onSelect,
  completed,
}: {
  current: StepKey;
  onSelect: (key: StepKey) => void;
  completed: StepKey[];
}) {
  return (
    <ol className="surface-card flex flex-wrap items-center gap-1 p-2">
      {STEPS.map((step, i) => {
        const isCurrent = step.key === current;
        const isDone = completed.includes(step.key);
        return (
          <li key={step.key} className="flex items-center">
            <button
              type="button"
              onClick={() => onSelect(step.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-[14.5px] font-medium transition-colors",
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-xs font-semibold",
                  isCurrent
                    ? "border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground"
                    : isDone
                      ? "border-emerald/30 bg-emerald-soft text-emerald"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {isDone && !isCurrent ? <Check className="size-3.5" /> : i + 1}
              </span>
              {step.label}
            </button>
            {i < STEPS.length - 1 ? (
              <span className="mx-1 h-px w-5 bg-border" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
