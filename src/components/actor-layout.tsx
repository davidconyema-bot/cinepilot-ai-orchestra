import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Clapperboard,
  ScrollText,
  CalendarDays,
  Bell,
  StickyNote,
  MessagesSquare,
  FolderOpen,
  UserRound,
  Settings,
  Film,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actorProfile, useActorStore } from "@/lib/actor-data";

const nav = [
  { to: "/actor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/actor/movies", label: "My Movies", icon: Clapperboard },
  { to: "/actor/scripts", label: "My Scripts", icon: ScrollText },
  { to: "/actor/schedule", label: "Shooting Schedule", icon: CalendarDays },
  { to: "/actor/notifications", label: "Notifications", icon: Bell },
  { to: "/actor/notes", label: "Director Notes", icon: StickyNote },
  { to: "/actor/messages", label: "Production Messages", icon: MessagesSquare },
  { to: "/actor/documents", label: "Documents", icon: FolderOpen },
  { to: "/actor/profile", label: "Profile", icon: UserRound },
  { to: "/actor/settings", label: "Settings", icon: Settings },
] as const;

export function ActorLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const unread = useActorStore((s) => s.notices.filter((n) => n.unread).length);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />

      <div className="relative flex min-h-screen">
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border/50 glass-strong">
          <div className="flex h-16 items-center gap-2 border-b border-border/40 px-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/50 blur-md" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold tracking-tight">
                CinePilot
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Actor Studio
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {nav.map((item) => {
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="actor-active-nav"
                      className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                  {item.to === "/actor/notifications" && unread > 0 && (
                    <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border/40 p-3">
            <div className="glass rounded-xl p-3">
              <div className="text-xs font-medium">{actorProfile.name}</div>
              <div className="text-[11px] text-muted-foreground">{actorProfile.agency}</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 lg:pl-64">
          <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/40 glass-strong px-4 md:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
                <Film className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">CinePilot</span>
            </div>
            <Badge variant="outline" className="gap-1.5 border-primary/40 text-primary">
              Actor workspace
            </Badge>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden flex-col items-end leading-tight sm:flex">
                <span className="text-xs font-medium">{actorProfile.name}</span>
                <span className="text-[10px] text-muted-foreground">{actorProfile.role}</span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                {actorProfile.name.charAt(0)}
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-border/40 px-2 py-2 lg:hidden">
            {nav.map((item) => {
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${
                    active ? "bg-primary/20 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
