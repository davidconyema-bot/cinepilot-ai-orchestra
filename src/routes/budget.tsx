import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { PageHeader, SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { budgetBreakdown, spendingTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/budget")({
  component: Budget,
  head: () => ({
    meta: [
      { title: "Budget — CinePilot AI" },
      { name: "description", content: "Cost breakdown, forecast, and AI cost-saving recommendations." },
    ],
  }),
});

const recs = [
  {
    title: "Switch Alexa Mini LF to Sony Venice 2",
    save: 62_000,
    reason: "Equal image quality for 82% of scheduled scenes; saves $18k/day rental.",
  },
  {
    title: "Consolidate Malibu and Griffith into one week",
    save: 38_000,
    reason: "Reduces travel days by 3 and per-diem costs across 34 crew.",
  },
  {
    title: "Book catering vendor Skyline Kitchen",
    save: 14_500,
    reason: "22% cheaper than current vendor for equivalent menu tiers.",
  },
];

function Budget() {
  const total = budgetBreakdown.reduce((s, x) => s + x.value, 0);

  return (
    <>
      <PageHeader
        title="Budget & Forecast"
        subtitle="Live cost analytics. Budget Agent flags overruns and proposes alternatives autonomously."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          index={0}
          label="Total Budget"
          value={`$${(total / 1_000_000).toFixed(2)}M`}
          hint="Across 4 productions"
          icon={Wallet}
          accent="oklch(0.72 0.19 305)"
        />
        <StatCard
          index={1}
          label="Spent to date"
          value="$3.9M"
          hint="82% of committed"
          delta={-3}
          icon={TrendingDown}
          accent="oklch(0.75 0.17 160)"
        />
        <StatCard
          index={2}
          label="Forecast overrun"
          value="+$142k"
          hint="Neon Skyline · Q3"
          delta={2}
          icon={TrendingUp}
          accent="oklch(0.68 0.22 25)"
        />
        <StatCard
          index={3}
          label="AI-suggested savings"
          value="$114.5k"
          hint="3 recommendations pending"
          icon={Sparkles}
          accent="oklch(0.80 0.17 75)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SectionCard title="Cost Breakdown" subtitle="By category">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {budgetBreakdown.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="none" />
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
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {budgetBreakdown.map((b) => (
              <div key={b.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: b.color }}
                />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="font-mono text-muted-foreground">
                  ${(b.value / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Spending Trend & Forecast"
          subtitle="Weekly spend ($k)"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrend}>
                <defs>
                  <linearGradient id="spent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 305)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 305)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.17 160)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.75 0.17 160)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="week" stroke="oklch(0.68 0.02 260)" fontSize={12} />
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
                  dataKey="forecast"
                  stroke="oklch(0.75 0.17 160)"
                  fill="url(#fc)"
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="oklch(0.72 0.19 305)"
                  fill="url(#spent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="Category spend vs. plan"
          subtitle="Actual vs. budgeted"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="name" stroke="oklch(0.68 0.02 260)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.02 260)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.02 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                  formatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {budgetBreakdown.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="AI Cost Recommendations"
          subtitle="From Budget Agent"
        >
          <div className="space-y-3">
            {recs.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-sm font-semibold text-success shrink-0">
                    −${(r.save / 1000).toFixed(1)}k
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{r.reason}</div>
                <div className="mt-2 flex gap-2">
                  <button className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    Apply
                  </button>
                  <button className="rounded-md border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
