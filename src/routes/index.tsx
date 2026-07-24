import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Bot, Wallet, Users, CalendarDays, Film } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import { StatCard } from "@/components/stat-card";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDashboardStats, useStore, timeAgo } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — CinePilot AI" },
      {
        name: "description",
        content: "Live production command center powered by autonomous AI agents.",
      },
    ],
  }),
});

function Dashboard() {
  const stats = useDashboardStats();
  const budgetItems = useStore((s) => s.budgetItems);
  const shootDays = useStore((s) => s.shootDays);
  const notifications = useStore((s) => s.notifications);

  const palette = [
    "oklch(0.72 0.19 305)",
    "oklch(0.70 0.17 220)",
    "oklch(0.75 0.17 160)",
    "oklch(0.80 0.17 75)",
    "oklch(0.68 0.22 25)",
    "oklch(0.72 0.14 265)",
    "oklch(0.72 0.18 340)",
    "oklch(0.75 0.14 190)",
  ];
  const pieData = budgetItems.map((b, i) => ({
    name: b.category,
    value: b.amount,
    color: palette[i % palette.length],
  }));

  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = [...shootDays].filter((d) => d.date >= todayIso).slice(0, 6);

  // Progress chart derived from productions
  const progressData = stats.productions.slice(0, 8).map((p) => ({
    title: p.title,
    completed: p.completedDays,
    remaining: Math.max(0, p.shootDays - p.completedDays),
  }));

  return (
    <>
      <PageHeader
        title="Production Command Center"
        subtitle="Live overview of every active production, agent, and risk — orchestrated by CinePilot AI."
        action={
          <Badge className="gap-1.5 bg-primary/20 text-primary border-primary/30">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            All systems nominal
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          index={0}
          label="Production Progress"
          value={`${stats.avgProgress}%`}
          hint={`${stats.productions.length} productions tracked`}
          icon={Activity}
          accent="oklch(0.72 0.19 305)"
        />
        <StatCard
          index={1}
          label="Active Productions"
          value={`${stats.activeCount}`}
          hint="In / Pre-Production"
          icon={Film}
          accent="oklch(0.70 0.17 220)"
        />
        <StatCard
          index={2}
          label="Total Budget"
          value={`$${(stats.totalBudget / 1_000_000).toFixed(2)}M`}
          hint={`$${(stats.totalSpent / 1_000_000).toFixed(2)}M committed`}
          icon={Wallet}
          accent="oklch(0.80 0.17 75)"
        />
        <StatCard
          index={3}
          label="Upcoming Shoot Days"
          value={`${stats.upcomingShootDays}`}
          hint={`${stats.totalCrew} total crew`}
          icon={CalendarDays}
          accent="oklch(0.75 0.17 160)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SectionCard
          className="lg:col-span-2"
          title="Shoot Day Completion"
          subtitle="Per production"
        >
          <div className="h-64">
            {progressData.length === 0 ? (
              <Empty label="No productions yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="title" stroke="oklch(0.68 0.02 260)" fontSize={11} />
                  <YAxis stroke="oklch(0.68 0.02 260)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.20 0.02 260)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      borderRadius: 12,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="oklch(0.72 0.19 305)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="remaining" stackId="a" fill="oklch(1 0 0 / 0.1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Budget Allocation" subtitle="Live from expenses">
          <div className="h-64">
            {pieData.length === 0 ? (
              <Empty label="No expenses yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.20 0.02 260)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      borderRadius: 12,
                    }}
                    formatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="Upcoming Shoot Days"
          subtitle="Derived from schedule"
        >
          {upcoming.length === 0 ? (
            <Empty label="Nothing on the calendar" />
          ) : (
            <div className="space-y-2">
              {upcoming.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 rounded-lg border border-border/40 bg-white/5 p-3"
                >
                  <div className="text-xs font-mono text-muted-foreground w-20">
                    {new Date(d.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1 text-sm truncate">
                    {d.location} · {d.scenes.join(", ") || "—"}
                  </div>
                  {d.conflict && (
                    <Badge className="bg-destructive/20 text-destructive border-0">Conflict</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-3 text-right">
            <Link to="/schedule" className="text-xs text-primary hover:underline">
              Open schedule →
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" subtitle="Notifications">
          <div className="space-y-2">
            {notifications.slice(0, 6).map((n) => (
              <div
                key={n.id}
                className="rounded-lg border border-border/40 bg-white/5 p-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                </div>
                <div className="text-muted-foreground mt-0.5 line-clamp-2">{n.message}</div>
              </div>
            ))}
            {notifications.length === 0 && <Empty label="No activity yet" />}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        className="mt-6"
        title="Productions overview"
        subtitle="Progress across your slate"
      >
        {stats.productions.length === 0 ? (
          <Empty label="No productions yet" />
        ) : (
          <div className="space-y-3">
            {stats.productions.map((p) => (
              <div key={p.id} className="rounded-lg border border-border/40 bg-white/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">{p.title}</div>
                  <Badge variant="outline" className="text-[10px]">
                    {p.status}
                  </Badge>
                </div>
                <Progress value={p.progress} className="h-1.5" />
                <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {p.crew}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bot className="h-3 w-3" />9 agents
                  </span>
                  <span className="ml-auto">
                    ${(p.spent / 1000).toFixed(0)}k / ${(p.budget / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Spacer for old imports referenced by TS */}
      <div className="hidden">
        <AreaChart data={[]} />
      </div>
    </>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}
