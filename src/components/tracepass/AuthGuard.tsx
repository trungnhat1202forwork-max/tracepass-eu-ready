import { useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/tracepass/auth";
import { useWorkspaceRole } from "@/lib/tracepass/role";
import { Brandmark } from "./Brandmark";

// Public routes accessible without authentication
const PUBLIC_PATHS = ["/", "/dang-nhap", "/dat-lai-mat-khau", "/admin"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/dpp/cong-khai")) return true;
  return false;
}

// Routes reserved specifically for SME role
const SME_ONLY_PREFIXES = [
  "/tong-quan",
  "/san-pham",
  "/nha-cung-cap",
  "/kho-du-lieu",
  "/ho-so",
  "/muc-do-san-sang",
  "/dpp",
  "/theo-doi",
];

// Routes reserved specifically for Supplier role
const SUPPLIER_ONLY_PREFIXES = ["/cong-nha-cung-cap"];

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, role, loading, loadingRole } = useAuth();
  const { isAdmin } = useWorkspaceRole();
  const navigate = useNavigate();

  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    // If user is in Admin mode (local session), grant full bypass to all routes
    if (isAdmin) {
      return;
    }

    if (loading) return;

    // 1. Not logged in and trying to access a private route
    if (!isPublic && !user) {
      void navigate({ to: "/dang-nhap" });
      return;
    }

    // 2. Already logged in and trying to access /dang-nhap (redirect to role dashboard)
    if (pathname === "/dang-nhap" && user && !loadingRole) {
      void navigate({ to: role === "supplier" ? "/cong-nha-cung-cap" : "/tong-quan" });
      return;
    }

    // 3. SME user trying to access supplier routes
    if (user && role === "sme" && !loadingRole) {
      const isSupplierRoute = SUPPLIER_ONLY_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      );
      if (isSupplierRoute) {
        void navigate({ to: "/tong-quan" });
        return;
      }
    }

    // 4. Supplier user trying to access SME routes
    if (user && role === "supplier" && !loadingRole) {
      const isSmeRoute = SME_ONLY_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      );
      if (isSmeRoute) {
        void navigate({ to: "/cong-nha-cung-cap" });
        return;
      }
    }
  }, [pathname, isPublic, user, role, loading, loadingRole, isAdmin, navigate]);

  // If public route or Admin mode, render immediately
  if (isPublic || isAdmin) {
    return <>{children}</>;
  }

  // Show loading spinner while determining auth & role on protected routes
  if (loading || (user && loadingRole)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
          <Brandmark className="size-12 animate-pulse" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">TRACEPASS B2B</p>
            <p className="mt-1 text-xs text-muted-foreground">Đang xác thực quyền truy cập...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated on a protected route, block render until redirect triggers
  if (!user) {
    return null;
  }

  // Prevent flash of wrong role content while redirecting
  if (role === "sme" && SUPPLIER_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }
  if (role === "supplier" && SME_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return <>{children}</>;
}
