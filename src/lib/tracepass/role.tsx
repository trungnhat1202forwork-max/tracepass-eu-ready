import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type WorkspaceRole = "sme" | "supplier";

type RoleContextValue = {
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  organizationName: string;
};

const RoleContext = createContext<RoleContextValue | null>(null);
const KEY = "tracepass-workspace-role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<WorkspaceRole>("sme");

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "supplier" || saved === "sme") setRoleState(saved);
  }, []);

  const setRole = (next: WorkspaceRole) => {
    setRoleState(next);
    window.localStorage.setItem(KEY, next);
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      organizationName: role === "sme" ? "Vision Textile JSC" : "GreenWeave Spinning Mill",
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useWorkspaceRole() {
  const value = useContext(RoleContext);
  if (!value) throw new Error("useWorkspaceRole must be used inside RoleProvider");
  return value;
}
