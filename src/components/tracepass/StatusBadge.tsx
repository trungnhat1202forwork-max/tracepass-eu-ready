import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Clock,
  Eye,
  FileWarning,
  OctagonAlert,
  RefreshCw,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  alertStatusLabel,
  docStatusLabel,
  readinessLabel,
  requirementBadgeLabel,
  type AlertStatus,
  type DocStatus,
  type ReadinessKey,
} from "@/lib/tracepass/data";

type Tone = "ready" | "warn" | "review" | "critical" | "neutral" | "info";

const toneClass: Record<Tone, string> = {
  ready: "bg-emerald-soft text-emerald border-emerald/25",
  warn: "bg-amber-soft text-amber border-amber/30",
  review: "bg-info-soft text-info border-info/25",
  critical: "bg-danger-soft text-destructive border-destructive/25",
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-primary-soft text-primary border-primary/20",
};

function Pill({
  tone,
  icon: Icon,
  children,
  className,
}: {
  tone: Tone;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-medium whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

const readinessTone: Record<ReadinessKey, Tone> = {
  ready: "ready",
  action: "warn",
  review: "review",
  critical: "critical",
};
const readinessIcon: Record<ReadinessKey, LucideIcon> = {
  ready: CheckCircle2,
  action: AlertTriangle,
  review: Eye,
  critical: OctagonAlert,
};

export function ReadinessBadge({
  status,
  className,
}: {
  status: ReadinessKey;
  className?: string | undefined;
}) {
  return (
    <Pill tone={readinessTone[status]} icon={readinessIcon[status]} className={className}>
      {readinessLabel[status]}
    </Pill>
  );
}

const docTone: Record<DocStatus, Tone> = {
  missing: "critical",
  uploaded: "info",
  review: "warn",
  done: "ready",
};
const docIcon: Record<DocStatus, LucideIcon> = {
  missing: CircleDashed,
  uploaded: Upload,
  review: Eye,
  done: CheckCircle2,
};

export function DocStatusBadge({ status }: { status: DocStatus }) {
  return (
    <Pill tone={docTone[status]} icon={docIcon[status]}>
      {docStatusLabel[status]}
    </Pill>
  );
}

const alertTone: Record<AlertStatus, Tone> = {
  upcoming: "neutral",
  "due-soon": "warn",
  expired: "critical",
  update: "review",
};
const alertIcon: Record<AlertStatus, LucideIcon> = {
  upcoming: Clock,
  "due-soon": AlertTriangle,
  expired: FileWarning,
  update: RefreshCw,
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return (
    <Pill tone={alertTone[status]} icon={alertIcon[status]}>
      {alertStatusLabel[status]}
    </Pill>
  );
}

export function RequirementBadge({ kind }: { kind: keyof typeof requirementBadgeLabel }) {
  const tone: Tone =
    kind === "current" ? "info" : kind === "dpp" ? "ready" : kind === "future" ? "neutral" : "warn";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClass[tone],
      )}
    >
      {requirementBadgeLabel[kind]}
    </span>
  );
}
