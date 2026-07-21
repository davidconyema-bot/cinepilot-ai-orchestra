import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  delta?: number;
  icon: LucideIcon;
  accent?: string;
  index?: number;
}

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  accent = "oklch(0.72 0.19 305)",
  index = 0,
}: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass relative overflow-hidden rounded-2xl p-5"
    >
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-3xl"
        style={{ background: accent }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {value}
          </div>
          {hint && (
            <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${accent.replace(")", " / 0.15)")}` }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
      {delta !== undefined && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
            up
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive"
          )}
        >
          {up ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(delta)}% vs last week
        </div>
      )}
    </motion.div>
  );
}
