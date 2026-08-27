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
  LogOut,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
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

interface NavGroup {
  groupTitle: string;
  items: {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const t = useTranslations();
  const { role, organizationName, isAdmin, exitAdmin } = useWorkspaceRole();
  const { user, profile, signOut } = useAuth();

  const handleAdminExit = () => {
    exitAdmin();
    toast.info("Đã thoát chế độ Quản trị viên.");
    void navigate({ to: "/dang-nhap" });
  };

  // Build navigation groups based on role or Admin status
  const navGroups: NavGroup[] = isAdmin
    ? [
        {
          groupTitle: "PHÂN HỆ DOANH NGHIỆP (SME)",
          items: [
            { to: "/tong-quan", label: "Tổng quan SME", icon: LayoutDashboard },
            { to: "/san-pham", label: "Quản lý sản phẩm", icon: Package },
            { to: "/nha-cung-cap", label: "Nhà cung cấp chuỗi", icon: Network },
            { to: "/kho-du-lieu", label: "Kho dữ liệu", icon: Database },
            { to: "/ho-so", label: "Hồ sơ tuân thủ", icon: FileText },
            { to: "/muc-do-san-sang", label: "Mức độ sẵn sàng", icon: ShieldCheck },
            { to: "/dpp", label: "Hộ chiếu DPP", icon: QrCode },
            { to: "/theo-doi", label: "Cảnh báo & Giám sát", icon: Bell },
          ],
        },
        {
          groupTitle: "PHÂN HỆ NHÀ CUNG CẤP (SUPPLIER)",
          items: [
            { to: "/cong-nha-cung-cap", label: "Cổng tiếp nhận Supplier", icon: Gauge },
            { to: "/nha-cung-cap", label: "Kết nối đối tác", icon: Network },
            { to: "/kho-du-lieu", label: "Dữ liệu đã chia sẻ", icon: Database },
            { to: "/ho-so", label: "Hồ sơ & chứng nhận", icon: FileText },
            { to: "/muc-do-san-sang", label: "AI kiểm tra dữ liệu", icon: Sparkles },
            { to: "/theo-doi", label: "Yêu cầu & thời hạn", icon: Bell },
          ],
        },
        {
          groupTitle: "HỆ THỐNG & QUẢN TRỊ",
          items: [
            { to: "/admin", label: "Trung tâm Admin", icon: ShieldAlert },
            { to: "/cai-dat", label: "Cài đặt chung", icon: Settings },
          ],
        },
      ]
    : [
        {
          groupTitle: role === "sme" ? "DOANH NGHIỆP (SME)" : "NHÀ CUNG CẤP (SUPPLIER)",
          items:
            role === "sme"
              ? [
                  { to: "/tong-quan", label: t.nav.overview, icon: LayoutDashboard },
                  { to: "/san-pham", label: t.nav.products, icon: Package },
                  { to: "/nha-cung-cap", label: "Nhà cung cấp", icon: Network },
                  { to: "/kho-du-lieu", label: "Kho dữ liệu", icon: Database },
                  { to: "/ho-so", label: t.nav.profile, icon: FileText },
                  { to: "/muc-do-san-sang", label: t.nav.readiness, icon: ShieldCheck },
                  { to: "/dpp", label: t.nav.dpp, icon: QrCode },
                  { to: "/theo-doi", label: t.nav.tracking, icon: Bell },
                  { to: "/cai-dat", label: t.nav.settings, icon: Settings },
                ]
              : [
                  { to: "/cong-nha-cung-cap", label: "Tổng quan Supplier", icon: Gauge },
                  { to: "/nha-cung-cap", label: "Kết nối đối tác", icon: Network },
                  { to: "/kho-du-lieu", label: "Dữ liệu đã chia sẻ", icon: Database },
                  { to: "/ho-so", label: "Hồ sơ & chứng nhận", icon: FileText },
                  { to: "/muc-do-san-sang", label: "AI kiểm tra dữ liệu", icon: Sparkles },
                  { to: "/theo-doi", label: "Yêu cầu & thời hạn", icon: Bell },
                  { to: "/cai-dat", label: "Cài đặt", icon: Settings },
                ],
        },
      ];

  const homeRoute = isAdmin ? "/admin" : role === "sme" ? "/tong-quan" : "/cong-nha-cung-cap";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label={t.shell.backHome}
          >
            <Home className="size-3.5" aria-hidden />
            {t.shell.backHome}
          </Link>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              ADMIN MODE
            </span>
          )}
        </div>

        <Link to={homeRoute} className="flex items-center gap-3 px-5 pt-2 pb-4">
          <Brandmark className="size-10 shrink-0" />
          <span className="leading-tight">
            <span className="block text-[17px] font-bold tracking-tight text-sidebar-foreground">
              TRACEPASS
            </span>
            <span className="block text-xs font-medium text-muted-foreground">
              {isAdmin ? "Admin Unified Hub" : t.shell.tagline}
            </span>
          </span>
        </Link>

        {/* Scrollable nav for grouped links */}
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-1">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {isAdmin && (
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  {group.groupTitle}
                </div>
              )}
              {group.items.map((item, itemIdx) => {
                const active =
                  pathname === item.to ||
                  (item.to !== "/tong-quan" &&
                    item.to !== "/cong-nha-cung-cap" &&
                    item.to !== "/admin" &&
                    pathname.startsWith(item.to));
                return (
                  <Link
                    key={`${item.to}-${itemIdx}`}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {isAdmin ? (
            <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  ADM
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold tracking-wide text-primary uppercase">
                    CHẾ ĐỘ QUẢN TRỊ VIÊN
                  </span>
                  <span className="block truncate text-xs font-semibold text-foreground">
                    Toàn quyền SME + Supplier
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs h-7 gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                onClick={handleAdminExit}
              >
                <LogOut className="size-3.5" />
                Thoát chế độ Admin
              </Button>
            </div>
          ) : (
            <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg text-xs font-bold text-white",
                  role === "sme" ? "bg-primary" : "bg-emerald",
                )}
              >
                {role === "sme" ? "SME" : "SUP"}
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                  {role === "sme" ? "Doanh nghiệp (SME)" : "Nhà cung cấp (Supplier)"}
                </span>
                <span className="block truncate text-sm font-semibold text-foreground">
                  {organizationName}
                </span>
              </div>
            </div>
          )}
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

          <div className="hidden items-center gap-3 lg:flex">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-bold text-primary flex items-center gap-1.5">
                  <ShieldAlert className="size-3.5" />
                  WORKSPACE QUẢN TRỊ VIÊN TỔNG (SME + SUPPLIER)
                </span>
                <span className="text-xs text-muted-foreground">
                  Truy cập đầy đủ tính năng 2 bên mà không bị hạn chế.
                </span>
              </div>
            ) : (
              <nav className="flex items-center gap-1">
                {navGroups[0]?.items.slice(0, 6).map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

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

            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    AD
                  </span>
                  <span className="hidden text-sm font-semibold sm:block text-foreground">
                    Quản trị viên (Admin)
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">Quản trị viên Hệ thống</p>
                    <p className="text-xs text-muted-foreground">Chế độ MVP (SessionStorage)</p>
                    <span className="mt-1.5 inline-block rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      Toàn quyền: SME & Nhà cung cấp
                    </span>
                  </div>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive gap-2 font-medium"
                    onClick={handleAdminExit}
                  >
                    <LogOut className="size-4" />
                    Thoát chế độ Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {(user.email?.slice(0, 2) ?? "TP").toUpperCase()}
                  </span>
                  <span className="hidden text-sm font-medium sm:block">{organizationName}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-semibold">
                      {profile?.full_name ??
                        user.user_metadata["full_name"] ??
                        "Thành viên TRACEPASS"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <span className="mt-1.5 inline-block rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Vai trò: {role === "sme" ? "Doanh nghiệp (SME)" : "Nhà cung cấp (Supplier)"}
                    </span>
                  </div>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => void signOut()}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
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
