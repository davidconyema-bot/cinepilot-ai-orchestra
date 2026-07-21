import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Wallet,
  Users,
  CalendarDays,
  FileText,
  AlertTriangle,
  ScrollText,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { StatCard } from "@/components/stat-card";
import { PageHeader, SectionCard } from "@/components/section-card";
import {
  agents,
  agentActivity,
  budgetBreakdown,
  crewUtilization,
  productions,
  progressData,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const activeProd = productions[0];

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
          value={`${activeProd.progress}%`}
          hint="Neon Skyline · Day 21 of 34"
          delta={4}
          icon={Activity}
          accent="oklch(0.72 0.19 305)"
        />
        <StatCard
          index={1}
          label="Active AI Agents"
          value="9 / 9"
          hint="Producer Agent orchestrating"
          delta={0}
          icon={Bot}
          accent="oklch(0.70 0.17 220)"
        />
        <StatCard
          index={2}
          label="Budget Usage"
          value="62%"
          hint="$2.98M of $4.8M"
          delta={-3}
          icon={Wallet}
          accent="oklch(0.80 0.17 75)"
        />
        <StatCard
          index={3}
          label="Crew Availability"
          value="84%"
          hint="70 of 84 confirmed"
          delta={6}
          icon={Users}
          accent="oklch(0.75 0.17 160)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SectionCard
          className="lg:col-span-2"
          title="Production Progress"
          subtitle="Planned vs. actual scenes completed this week"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.70 0.17 220)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.70 0.17 220)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 305)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 305)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.02 260)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.02 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="oklch(0.70 0.17 220)"
                  fill="url(#planned)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="oklch(0.72 0.19 305)"
                  fill="url(#actual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Budget Allocation" subtitle="By category">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {budgetBreakdown.map((entry) => (
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
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SectionCard
          title="Shooting Completion"
          subtitle="Days shot vs. remaining"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productions.filter((p) => p.shootDays > 0)}>
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
                <Bar dataKey="completedDays" fill="oklch(0.72 0.19 305)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="shootDays" fill="oklch(1 0 0 / 0.1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Daily Crew Utilization" subtitle="Percent booked">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crewUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 260)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.02 260)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.02 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="oklch(0.75 0.17 160)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "oklch(0.75 0.17 160)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Risk Alerts" subtitle="Detected by AI">
          <div className="space-y-2.5">
            {[
              { level: "high", msg: "Weather risk Thursday — 60% rain", icon: AlertTriangle },
              { level: "med", msg: "Marcus V. double-booked Jul 23", icon: Users },
              { level: "med", msg: "Equipment rental over budget", icon: Wallet },
              { level: "low", msg: "Rotary phone prop unconfirmed", icon: FileText },
            ].map((r) => (
              <div
                key={r.msg}
                className="flex items-start gap-3 rounded-lg border border-border/40 bg-white/5 p-3"
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-md ${
                    r.level === "high"
                      ? "bg-destructive/20 text-destructive"
                      : r.level === "med"
                      ? "bg-warning/20 text-warning"
                      : "bg-info/20 text-info"
                  }`}
                >
                  <r.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 text-sm">{r.msg}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="Production Timeline"
          subtitle="Upcoming shoot days and milestones"
        >
          <div className="space-y-3">
            {[
              { date: "Jul 22", event: "Rooftop chase — Scene 12–13", tag: "Shoot" },
              { date: "Jul 23", event: "Warehouse dialogue — Scenes 14–16", tag: "Shoot" },
              { date: "Jul 24", event: "Griffith Observatory — Scene 17", tag: "Weather Risk" },
              { date: "Jul 25", event: "Sound Stage 4 — Scenes 18–19", tag: "Interior" },
              { date: "Jul 26", event: "Malibu Beach — Scene 20", tag: "Shoot" },
              { date: "Jul 30", event: "Producer review · dailies screening", tag: "Milestone" },
            ].map((t, i) => (
              <motion.div
                key={t.event}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-lg border border-border/40 bg-white/5 p-3"
              >
                <div className="text-xs font-mono text-muted-foreground w-16">
                  {t.date}
                </div>
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 text-sm">{t.event}</div>
                <Badge variant="outline" className="text-xs border-border/60">
                  {t.tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Script Revision Status" subtitle="Neon Skyline">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-primary" />
                  Version 4.2
                </span>
                <Badge className="bg-success/20 text-success border-0">Parsed</Badge>
              </div>
              <Progress value={88} className="h-2" />
              <div className="text-xs text-muted-foreground">
                142 scenes · 18 characters · 9 locations
              </div>
              <div className="text-xs text-muted-foreground">
                Last revision 2h ago · 3 new scenes, 1 removed
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Upcoming Shoot Days" subtitle="Next 5 days">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((_d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md bg-white/5 p-2 text-xs"
                >
                  <CalendarDays className="h-4 w-4 text-accent" />
                  <span className="font-mono">Jul {22 + i}</span>
                  <span className="text-muted-foreground truncate">
                    {["Rooftop", "Warehouse", "Observatory", "Sound Stage", "Beach"][i]}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        className="mt-6"
        title="Agent Activity"
        subtitle="Latest autonomous decisions made by CinePilot agents"
      >
        <div className="space-y-2">
          {agentActivity.map((a, i) => {
            const agent = agents.find((x) =>
              a.agent.toLowerCase().includes(x.name.toLowerCase().split(" ")[0])
            );
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-muted-foreground w-14">
                  {a.time}
                </span>
                <span>{agent?.emoji ?? "🤖"}</span>
                <span className="font-medium text-foreground/90 w-40 shrink-0">
                  {a.agent}
                </span>
                <span className="flex-1 text-muted-foreground truncate">
                  {a.action}
                </span>
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
              </motion.div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
