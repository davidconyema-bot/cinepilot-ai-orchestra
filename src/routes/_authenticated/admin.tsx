import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Shield, Users, Activity, Database, ShieldAlert, Loader2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agents, agentActivity } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ALL_ROLES, ROLE_LABELS, type AppRole } from "@/lib/auth";
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

interface MemberRow {
  id: string;
  email: string | null;
  full_name: string | null;
  job_title: string | null;
  roles: AppRole[];
}

function AdminPage() {
  const { hasRole, loading, user } = useAuth();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [fetching, setFetching] = useState(true);

  const load = useCallback(async () => {
    setFetching(true);
    const [{ data: profiles }, { data: roleRows }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, job_title"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const byUser = new Map<string, AppRole[]>();
    ((roleRows ?? []) as { user_id: string; role: AppRole }[]).forEach((r) => {
      byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r.role]);
    });
    setMembers(
      ((profiles ?? []) as Omit<MemberRow, "roles">[]).map((p) => ({
        ...p,
        roles: byUser.get(p.id) ?? [],
      })),
    );
    setFetching(false);
  }, []);

  useEffect(() => {
    if (!loading && hasRole("producer")) void load();
  }, [loading, hasRole, load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking permissions…
      </div>
    );
  }

  if (!hasRole("producer")) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md glass rounded-2xl p-6 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/15">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold">Producer access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn't have the Producer role. Ask a producer on your production to grant
          you access from the admin console.
        </p>
      </motion.div>
    );
  }

  async function setRole(userId: string, role: AppRole) {
    const { error: delError } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (delError) {
      toast.error(delError.message);
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Role updated to ${ROLE_LABELS[role]}`);
    void load();
  }

  const stats = [
    { label: "Team members", value: members.length, icon: Users },
    { label: "Active agents", value: agents.filter((a) => a.status === "active").length, icon: Activity },
    { label: "Recent events", value: agentActivity.length, icon: Database },
  ];

  return (
    <>
      <PageHeader
        title="Admin Console"
        subtitle="Manage team access, roles and system activity"
        action={
          <Badge className="gap-1.5 bg-primary/20 text-primary border-primary/30">
            <Shield className="h-3 w-3" /> Producer
          </Badge>
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
        <SectionCard title="Team members" subtitle="Accounts and production roles">
          {fetching ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading team…
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">
                      {m.full_name || m.email || "Unnamed"}
                      {m.id === user?.id && (
                        <span className="ml-2 text-[10px] text-muted-foreground">you</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  </div>
                  <Select
                    value={m.roles[0] ?? undefined}
                    onValueChange={(v) => setRole(m.id, v as AppRole)}
                  >
                    <SelectTrigger className="h-8 w-44 text-xs">
                      <SelectValue placeholder="No role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {!members.length && (
                <p className="text-sm text-muted-foreground">No team members yet.</p>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Agent roster" subtitle="Manage specialist agents">
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {agents.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1.5 text-xs"
              >
                <span>{a.emoji}</span>
                <span className="flex-1">{a.name}</span>
                <Badge
                  variant="outline"
                  className="text-[10px] border-border/60 text-muted-foreground"
                >
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
