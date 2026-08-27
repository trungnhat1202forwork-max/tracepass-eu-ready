import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  Home,
  LayoutDashboard,
  Package,
  QrCode,
  Settings,
  ShieldCheck,
  Network,
  Database,
  Gauge,
  Sparkles,
  ChevronsUpDown,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/tracepass/i18n";
import { Brandmark } from "./Brandmark";
import { useWorkspaceRole } from "@/lib/tracepass/role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/tracepass/auth";
import { Button } from "@/components/ui/button";

function useNav() {
  const t = useTranslations();
  const { role } = useWorkspaceRole();
  const sme = [
    { to: "/tong-quan", label: t.nav.overview, icon: LayoutDashboard },
    { to: "/san-pham", label: t.nav.products, icon: Package },
    { to: "/nha-cung-cap", label: "Nhà cung cấp", icon: Network },
    { to: "/kho-du-lieu", label: "Kho dữ liệu", icon: Database },
    { to: "/ho-so", label: t.nav.profile, icon: FileText },
    { to: "/muc-do-san-sang", label: t.nav.readiness, icon: ShieldCheck },
    { to: "/dpp", label: t.nav.dpp, icon: QrCode },
    { to: "/theo-doi", label: t.nav.tracking, icon: Bell },
    { to: "/cai-dat", label: t.nav.settings, icon: Settings },
  ] as const;
  const supplier = [
    { to: "/cong-nha-cung-cap", label: "Tổng quan Supplier", icon: Gauge },
    { to: "/nha-cung-cap", label: "Kết nối đối tác", icon: Network },
    { to: "/kho-du-lieu", label: "Dữ liệu đã chia sẻ", icon: Database },
    { to: "/ho-so", label: "Hồ sơ & chứng nhận", icon: FileText },
    { to: "/muc-do-san-sang", label: "AI kiểm tra dữ liệu", icon: Sparkles },
    { to: "/theo-doi", label: "Yêu cầu & thời hạn", icon: Bell },
    { to: "/cai-dat", label: "Cài đặt", icon: Settings },
  ] as const;
  return role === "sme" ? sme : supplier;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useTranslations();
  const nav = useNav();
  const { role, setRole, organizationName } = useWorkspaceRole();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const switchRole = (nextRole: "sme" | "supplier") => {
    setRole(nextRole);
    void navigate({ to: nextRole === "sme" ? "/tong-quan" : "/cong-nha-cung-cap" });
  };

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

        <div className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/50">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                {role === "sme" ? "SME" : "SUP"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                  Vai trò {role === "sme" ? "Doanh nghiệp" : "Nhà cung cấp"}
                </span>
                <span className="block truncate text-sm font-semibold">{organizationName}</span>
              </span>
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuItem onClick={() => switchRole("sme")}>
                <span className="flex size-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
                  SME
                </span>
                <span>
                  <strong className="block">Vision Textile JSC</strong>
                  <small className="text-muted-foreground">Không gian doanh nghiệp</small>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("supplier")}>
                <span className="flex size-7 items-center justify-center rounded-md bg-emerald text-[10px] font-bold text-white">
                  SUP
                </span>
                <span>
                  <strong className="block">GreenWeave Mill</strong>
                  <small className="text-muted-foreground">Không gian nhà cung cấp</small>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {(user.email?.slice(0, 2) ?? "TP").toUpperCase()}
                  </span>
                  <span className="hidden text-sm font-medium sm:block">{organizationName}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold">
                      {user.user_metadata["full_name"] ?? "Thành viên TRACEPASS"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => void signOut()}>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/dang-nhap">Đăng nhập B2B</Link>
              </Button>
            )}
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
