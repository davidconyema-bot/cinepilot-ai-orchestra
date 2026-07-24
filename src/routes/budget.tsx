import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Pencil, Plus, Sparkles, Trash2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { BudgetItemDialog } from "@/components/budget-item-dialog";
import { useStore, type BudgetItem } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/budget")({
  component: Budget,
  head: () => ({
    meta: [
      { title: "Budget — CinePilot AI" },
      {
        name: "description",
        content: "Cost breakdown, forecast, and AI cost-saving recommendations.",
      },
    ],
  }),
});

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

function Budget() {
  const budgetItems = useStore((s) => s.budgetItems);
  const productions = useStore((s) => s.productions);
  const deleteBudgetItem = useStore((s) => s.deleteBudgetItem);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetItem | null>(null);

  const total = budgetItems.reduce((s, x) => s + x.amount, 0);
  const totalSpent = productions.reduce((s, p) => s + p.spent, 0);
  const totalProdBudget = productions.reduce((s, p) => s + p.budget, 0);
  const forecast = Math.max(0, totalSpent - totalProdBudget * 0.85);

  const data = budgetItems.map((b, i) => ({
    ...b,
    color: palette[i % palette.length],
  }));

  const remove = (b: BudgetItem) => {
    if (confirm(`Delete "${b.category}"?`)) {
      deleteBudgetItem(b.id);
      toast.success("Expense deleted");
    }
  };

  return (
    <>
      <PageHeader
        title="Budget & Forecast"
        subtitle="Live cost analytics. Budget Agent flags overruns and proposes alternatives autonomously."
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          index={0}
          label="Total Budget"
          value={`$${(total / 1_000_000).toFixed(2)}M`}
          hint={`${budgetItems.length} line items`}
          icon={Wallet}
          accent="oklch(0.72 0.19 305)"
        />
        <StatCard
          index={1}
          label="Spent to date"
          value={`$${(totalSpent / 1_000_000).toFixed(2)}M`}
          hint={`${total ? Math.round((totalSpent / total) * 100) : 0}% of committed`}
          icon={TrendingDown}
          accent="oklch(0.75 0.17 160)"
        />
        <StatCard
          index={2}
          label="Forecast overrun"
          value={`+$${(forecast / 1000).toFixed(0)}k`}
          hint="Across active productions"
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
            {data.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {data.map((e) => (
                      <Cell key={e.id} fill={e.color} stroke="none" />
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

        <SectionCard
          className="lg:col-span-2"
          title="Category Spend"
          subtitle="Bar chart of expense line items"
        >
          <div className="h-64">
            {data.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="category" stroke="oklch(0.68 0.02 260)" fontSize={11} />
                  <YAxis stroke="oklch(0.68 0.02 260)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.20 0.02 260)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      borderRadius: 12,
                    }}
                    formatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {data.map((e) => (
                      <Cell key={e.id} fill={e.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Expense line items" subtitle="Add, edit, or remove — totals recalculate live">
        {data.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border/40">
                  <th className="text-left py-2 font-medium">Category</th>
                  <th className="text-left py-2 font-medium">Description</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                  <th className="text-right py-2 font-medium">% Total</th>
                  <th className="text-right py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((b) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border/20 hover:bg-white/5"
                  >
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: b.color }}
                        />
                        {b.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{b.description}</td>
                    <td className="py-2.5 text-right font-mono">
                      ${b.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {total ? Math.round((b.amount / total) * 100) : 0}%
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(b);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove(b)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                <tr className="font-medium">
                  <td className="py-3" colSpan={2}>
                    Total
                  </td>
                  <td className="py-3 text-right font-mono">${total.toLocaleString()}</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <BudgetItemDialog open={open} onOpenChange={setOpen} editing={editing} />
    </>
  );
}

function Empty() {
  return (
    <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
      No expenses yet — click <span className="mx-1 text-foreground">Add expense</span> to start.
    </div>
  );
}
