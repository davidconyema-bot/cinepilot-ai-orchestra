import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Lock, LogOut, Shield, Users, Activity, Database, AlertTriangle } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { adminLogin, adminLogout, isAdminAuthed, ADMIN_EMAIL } from "@/lib/admin-auth";
import { agents, agentActivity } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Console — CinePilot AI" },
      { name: "description", content: "Restricted admin console for CinePilot AI." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (adminLogin(email, password)) {
      toast.success("Welcome, admin");
      onSuccess();
    } else {
      setErr("Invalid email or password");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">Admin Console</h1>
            <p className="text-xs text-muted-foreground">Restricted access</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-10 rounded-lg border border-border/60 bg-white/5 px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full h-10 rounded-lg border border-border/60 bg-white/5 px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
              required
            />
          </div>
          {err && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              {err}
            </div>
          )}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Lock className="h-4 w-4" />
            Sign in
          </button>
        </form>

        <p className="mt-4 text-[10px] text-muted-foreground">
          Demo gate. Client-side only — enable Lovable Cloud for real authentication.
        </p>
      </motion.div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  function signOut() {
    adminLogout();
    toast.success("Signed out");
    onLogout();
    navigate({ to: "/admin" });
  }

  const stats = [
    { label: "Active agents", value: agents.filter((a) => a.status === "active").length, icon: Activity },
    { label: "Total agents", value: agents.length, icon: Users },
    { label: "Recent events", value: agentActivity.length, icon: Database },
  ];

  return (
    <>
      <PageHeader
        title="Admin Console"
        subtitle={`Signed in as ${ADMIN_EMAIL}`}
        action={
          <div className="flex items-center gap-2">
            <Badge className="gap-1.5 bg-primary/20 text-primary border-primary/30">
              <Shield className="h-3 w-3" /> Admin
            </Badge>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="font-display text-2xl font-semibold">{s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Users" subtitle="Registered accounts">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-sm">
              <div>
                <div className="font-medium">David Conyema</div>
                <div className="text-xs text-muted-foreground">{ADMIN_EMAIL}</div>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">
                admin
              </Badge>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Agent roster" subtitle="Manage specialist agents">
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {agents.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1.5 text-xs"
              >
                <span>{a.emoji}</span>
                <span className="flex-1">{a.name}</span>
                <Badge variant="outline" className="text-[10px] border-border/60 text-muted-foreground">
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent agent activity"
          subtitle="System-wide audit log"
          className="lg:col-span-2"
        >
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {agentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-muted-foreground w-14">{a.time}</span>
                <span className="font-medium w-40 shrink-0">{a.agent}</span>
                <span className="flex-1 text-muted-foreground truncate">{a.action}</span>
                <Badge
                  variant="outline"
                  className={
                    a.status === "done"
                      ? "border-success/40 text-success"
                      : "border-warning/40 text-warning"
                  }
                >
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
