import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type WorkspaceRole = "sme" | "supplier";

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: WorkspaceRole;
  created_at?: string;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: WorkspaceRole;
  loading: boolean;
  loadingRole: boolean;
  setCustomSession: (user: {
    id: string;
    email: string;
    full_name: string;
    role: WorkspaceRole;
  }) => void;
  refreshProfile: () => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);
const LOCAL_USER_KEY = "tracepass-active-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<WorkspaceRole>("sme");
  const [loading, setLoading] = useState(true);
  const [loadingRole, setLoadingRole] = useState(false);

  const fetchProfile = useCallback(async (user: User | null): Promise<UserProfile | null> => {
    if (!user) {
      setProfile(null);
      setRole("sme");
      return null;
    }

    setLoadingRole(true);
    try {
      // 1. Try querying public.profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email ?? user.email ?? null,
          full_name: data.full_name ?? user.user_metadata["full_name"] ?? null,
          role: (data.role as WorkspaceRole) === "supplier" ? "supplier" : "sme",
          created_at: data.created_at,
        };
        setProfile(userProfile);
        setRole(userProfile.role);
        return userProfile;
      }

      // 2. Fallback to raw user metadata if table does not exist or trigger hasn't completed
      const metaRole =
        (user.user_metadata["role"] as WorkspaceRole) === "supplier" ? "supplier" : "sme";
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email ?? null,
        full_name: (user.user_metadata["full_name"] as string | undefined) ?? null,
        role: metaRole,
      };

      // Try inserting into profiles in case the trigger was missing
      void supabase
        .from("profiles")
        .upsert(fallbackProfile)
        .catch(() => {});

      setProfile(fallbackProfile);
      setRole(metaRole);
      return fallbackProfile;
    } catch (err) {
      console.warn("Failed to load user profile:", err);
      const metaRole =
        (user.user_metadata["role"] as WorkspaceRole) === "supplier" ? "supplier" : "sme";
      setRole(metaRole);
      return null;
    } finally {
      setLoadingRole(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // First check local stored session
    try {
      const savedLocal = window.localStorage.getItem(LOCAL_USER_KEY);
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal) as {
          id: string;
          email: string;
          full_name: string;
          role: WorkspaceRole;
        };
        if (parsed?.id) {
          const virtualUser: User = {
            id: parsed.id,
            app_metadata: {},
            user_metadata: { full_name: parsed.full_name, role: parsed.role },
            aud: "authenticated",
            created_at: new Date().toISOString(),
            email: parsed.email,
          };
          setLocalUser(virtualUser);
          setRole(parsed.role === "supplier" ? "supplier" : "sme");
          setProfile({
            id: parsed.id,
            email: parsed.email,
            full_name: parsed.full_name,
            role: parsed.role,
          });
        }
      }
    } catch (e) {
      console.warn("Error reading local user", e);
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setSession(data.session);
        if (data.session.user) {
          void fetchProfile(data.session.user);
        }
      }
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!mounted) return;
      setSession(next);
      setLoading(false);
      if (next?.user) {
        await fetchProfile(next.user);
      } else {
        const savedLocal = window.localStorage.getItem(LOCAL_USER_KEY);
        if (!savedLocal) {
          setProfile(null);
          setRole("sme");
          setLocalUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const setCustomSession = useCallback(
    (userData: { id: string; email: string; full_name: string; role: WorkspaceRole }) => {
      window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
      const virtualUser: User = {
        id: userData.id,
        app_metadata: {},
        user_metadata: { full_name: userData.full_name, role: userData.role },
        aud: "authenticated",
        created_at: new Date().toISOString(),
        email: userData.email,
      };
      setLocalUser(virtualUser);
      setRole(userData.role);
      setProfile({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
      });
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      return await fetchProfile(session.user);
    }
    return profile;
  }, [session?.user, profile, fetchProfile]);

  const currentUser = session?.user ?? localUser;

  const value = useMemo(
    () => ({
      session,
      user: currentUser,
      profile,
      role,
      loading,
      loadingRole,
      setCustomSession,
      refreshProfile,
      signOut: async () => {
        window.localStorage.removeItem(LOCAL_USER_KEY);
        setProfile(null);
        setLocalUser(null);
        setRole("sme");
        await supabase.auth.signOut();
      },
    }),
    [session, currentUser, profile, role, loading, loadingRole, setCustomSession, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
