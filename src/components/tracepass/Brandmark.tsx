import { useState } from "react";
import { cn } from "@/lib/utils";

export function Brandmark({ className }: { className?: string | undefined }) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    // Fallback if the logo asset is ever missing, so the layout never breaks.
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary text-primary-foreground",
          className,
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-[60%]" fill="none">
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M4.5 12h15M12 4.5c2.2 2.2 2.2 12.8 0 15M12 4.5c-2.2 2.2-2.2 12.8 0 15"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </span>
    );
  }

  return (
    <img
      src="/tracepass-mark.png"
      alt="TRACEPASS"
      className={cn("shrink-0 rounded-xl object-contain", className)}
      onError={() => setOk(false)}
    />
  );
}