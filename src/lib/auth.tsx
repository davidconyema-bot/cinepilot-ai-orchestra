import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "producer"
  | "director"
  | "assistant_director"
  | "production_manager"
  | "crew"
  | "viewer";

export const ROLE_LABELS: Record<AppRole, string> = {
  producer: "Producer",
  director: "Director",
  assistant_director: "Assistant Director",
  production_manager: "Production Manager",
  crew: "Crew",
  viewer: "Viewer",
};

export const ALL_ROLES = Object.keys(ROLE_LABELS) as AppRole[];

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setRoles([]);
      return;
    }
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, job_title")
        .eq("id", userId)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    setProfile((p as Profile) ?? null);
    setRoles(((r ?? []) as { role: AppRole }[]).map((x) => x.role));
  };

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      // Defer Supabase calls out of the auth callback.
      setTimeout(() => {
        void loadUserData(next?.user?.id);
      }, 0);
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadUserData(data.session?.user?.id);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: session?.user ?? null,
      session,
      profile,
      roles,
      loading,
      hasRole: (role) => roles.includes(role),
      hasAnyRole: (list) => list.some((role) => roles.includes(role)),
      refresh: () => loadUserData(session?.user?.id),
    };
  }, [session, profile, roles, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function displayName(profile: Profile | null, user: User | null) {
  return (
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    profile?.email ||
    user?.email ||
    "Crew member"
  );
}
