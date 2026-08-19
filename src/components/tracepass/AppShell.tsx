import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  Home,
  LayoutDashboard,
  Package,
  QrCode,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/tracepass/data";
import { useTranslations } from "@/lib/tracepass/i18n";
import { Brandmark } from "./Brandmark";

function useNav() {
  const t = useTranslations();
  return [
    { to: "/tong-quan", label: t.nav.overview, icon: LayoutDashboard },
    { to: "/san-pham", label: t.nav.products, icon: Package },
    { to: "/ho-so", label: t.nav.profile, icon: FileText },
    { to: "/muc-do-san-sang", label: t.nav.readiness, icon: ShieldCheck },
    { to: "/dpp", label: t.nav.dpp, icon: QrCode },
    { to: "/theo-doi", label: t.nav.tracking, icon: Bell },
    { to: "/cai-dat", label: t.nav.settings, icon: Settings },
  ] as const;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useTranslations();
  const nav = useNav();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2 px-4 pt-6 pb-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label={t.shell.backHome}
          >
            <Home className="size-3.5" aria-hidden />
            {t.shell.backHome}
          </Link>
        </div>
        <Link to="/tong-quan" className="flex items-center gap-3 px-6 pt-2 pb-6">
          <Brandmark className="size-10" />
          <span className="leading-tight">
            <span className="block text-[17px] font-bold tracking-tight text-sidebar-foreground">
              TRACEPASS
            </span>
            <span className="block text-xs font-medium text-muted-foreground">
              {t.shell.tagline}
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {nav.map((item) => {
            const active =
              pathname === item.to || (item.to !== "/tong-quan" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="size-[18px]" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-6 py-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t.shell.company}
          </p>
          <p className="mt-1 text-sm font-semibold text-sidebar-foreground">{COMPANY}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/85 px-6 py-3 backdrop-blur lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/" className="shrink-0" aria-label={t.shell.backHome}>
              <Brandmark className="size-8" />
            </Link>
            <span className="text-base font-bold">TRACEPASS</span>
            <Link
              to="/"
              className="ml-1 flex items-center gap-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t.shell.backHome}
            >
              <Home className="size-4" />
            </Link>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.slice(0, 6).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/theo-doi"
              className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t.shell.alertsAria}
            >
              <Bell className="size-[18px]" />
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                7
              </span>
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                VT
              </span>
              <span className="hidden text-sm font-medium sm:block">{COMPANY}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[30px] leading-tight font-bold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[15px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}