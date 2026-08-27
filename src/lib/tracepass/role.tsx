import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth, type WorkspaceRole } from "./auth";

export type { WorkspaceRole };

const ADMIN_STORAGE_KEY = "tracepass_admin";

type RoleContextValue = {
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  organizationName: string;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  exitAdmin: () => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { role, profile } = useAuth();
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const setIsAdmin = useCallback((val: boolean) => {
    setIsAdminState(val);
    try {
      if (typeof window !== "undefined") {
        if (val) {
          sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
        } else {
          sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn("sessionStorage error:", e);
    }
  }, []);

  const exitAdmin = useCallback(() => {
    setIsAdmin(false);
  }, [setIsAdmin]);

  useEffect(() => {
    const handleStorage = () => {
      try {
        if (typeof window !== "undefined") {
          setIsAdminState(sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true");
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const organizationName = useMemo(() => {
    if (isAdmin) {
      return "Quản trị viên Hệ thống";
    }
    if (profile?.full_name?.trim()) {
      return role === "sme" ? `${profile.full_name} (SME)` : `${profile.full_name} (Supplier)`;
    }
    return role === "sme" ? "Vision Textile JSC" : "GreenWeave Spinning Mill";
  }, [isAdmin, role, profile]);

  const value = useMemo(
    () => ({
      role,
      setRole: (_next: WorkspaceRole) => {
        // Role is strictly managed by user account in Supabase auth
      },
      organizationName,
      isAdmin,
      setIsAdmin,
      exitAdmin,
    }),
    [role, organizationName, isAdmin, setIsAdmin, exitAdmin],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useWorkspaceRole() {
  const value = useContext(RoleContext);
  if (!value) throw new Error("useWorkspaceRole must be used inside RoleProvider");
  return value;
}
