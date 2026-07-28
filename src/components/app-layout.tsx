import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  Sparkles,
  CalendarDays,
  Wallet,
  FileText,
  Bell,
  Film,
  Search,
  Cloud,
  Network,
  Shield,
  LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { CommandDock } from "@/components/command-dock";
import { Badge } from "@/components/ui/badge";
import { useAuth, displayName, ROLE_LABELS } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/agents", label: "Agent Center", icon: Bot },
  { to: "/command", label: "AI Command", icon: Sparkles },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/budget", label: "Budget", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/admin", label: "Admin", icon: Shield, producerOnly: true },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dockOpen, setDockOpen] = useState(false);
  const { user, profile, roles, hasRole } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const visibleNav = nav.filter((item) => !("producerOnly" in item) || hasRole("producer"));

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }


  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border/50 glass-strong">
          <div className="flex h-16 items-center gap-2 px-5 border-b border-border/40">
            <div className="relative">
              <div className="absolute inset-0 blur-md bg-primary/50 rounded-lg" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold tracking-tight">
                CinePilot
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                AI Studio
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {visibleNav.map((item) => {
              const active = pathname.startsWith(item.to);

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
                      layoutId="active-nav"
                      className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border/40">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Cloud className="h-3.5 w-3.5" />
                <span>Google Cloud</span>
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              </div>
              <div className="mt-2 text-xs text-foreground/80">
                Vertex AI · Firestore · Storage
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                Region us-central1
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/40 glass-strong px-4 md:px-8">
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
                <Film className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">CinePilot</span>
            </div>
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search scenes, crew, agents, reports…"
                className="w-full h-9 rounded-lg border border-border/60 bg-white/5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Badge
              variant="outline"
              className="hidden md:inline-flex gap-1.5 border-success/40 text-success"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              9 agents online
            </Badge>
            <button
              onClick={() => setDockOpen(true)}
              className="hidden md:inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask CinePilot
              <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>

            <div className="flex items-center gap-2 pl-1">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-xs font-medium">{displayName(profile, user)}</span>
                <span className="text-[10px] text-muted-foreground">
                  {roles.length ? roles.map((r) => ROLE_LABELS[r]).join(" · ") : "No role"}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                {displayName(profile, user).charAt(0).toUpperCase()}
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>


          {/* Mobile nav */}
          <div className="lg:hidden flex overflow-x-auto gap-1 px-2 py-2 border-b border-border/40">
            {visibleNav.map((item) => {
              const active = pathname.startsWith(item.to);

              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${
                    active
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground"
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

      <CommandDock open={dockOpen} onOpenChange={setDockOpen} />
    </div>
  );
}
