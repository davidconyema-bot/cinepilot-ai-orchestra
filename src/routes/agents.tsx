import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Wrench } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { agents, agentActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/agents")({
  component: AgentCenter,
  head: () => ({
    meta: [
      { title: "AI Operations Center — CinePilot AI" },
      { name: "description", content: "Live view of autonomous production agents." },
    ],
  }),
});

const statusStyle: Record<string, string> = {
  active: "border-success/40 text-success",
  thinking: "border-info/40 text-info",
  idle: "border-border/60 text-muted-foreground",
  error: "border-destructive/40 text-destructive",
};

function AgentCenter() {
  return (
    <>
      <PageHeader
        title="AI Operations Center"
        subtitle="Nine autonomous agents, one Producer. Compatible with LangGraph, AutoGen and CrewAI."
        action={
          <Badge className="gap-1.5 bg-success/20 text-success border-success/30">
            <Activity className="h-3 w-3" /> Orchestrator online
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-5 relative overflow-hidden"
          >
            <div
              className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-25 blur-3xl"
              style={{ background: a.color }}
            />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `color-mix(in oklab, ${a.color} 20%, transparent)` }}
                >
                  {a.emoji}
                </div>
                <div>
                  <div className="font-display font-semibold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                </div>
              </div>
              <Badge variant="outline" className={statusStyle[a.status]}>
                <span className={`mr-1 h-1.5 w-1.5 rounded-full ${
                  a.status === "active" ? "bg-success animate-pulse" :
                  a.status === "thinking" ? "bg-info animate-pulse" : "bg-muted-foreground"
                }`} />
                {a.status}
              </Badge>
            </div>

            <div className="relative mt-4">
              <div className="text-xs text-muted-foreground">Current task</div>
              <div className="mt-0.5 text-sm">{a.currentTask}</div>
            </div>

            <div className="relative mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{a.progress}%</span>
              </div>
              <Progress value={a.progress} className="h-1.5" />
            </div>

            <div className="relative mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/5 p-2">
                <div className="text-muted-foreground">Confidence</div>
                <div className="font-display text-lg font-semibold" style={{ color: a.color }}>
                  {a.confidence}%
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-2">
                <div className="text-muted-foreground">Tools</div>
                <div className="font-display text-lg font-semibold">{a.tools.length}</div>
              </div>
            </div>

            <div className="relative mt-3 text-xs text-muted-foreground">
              <span className="text-foreground/70">Last:</span> {a.lastAction}
            </div>

            <div className="relative mt-3 flex flex-wrap gap-1">
              {a.tools.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                >
                  <Wrench className="h-2.5 w-2.5" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <SectionCard
        className="mt-6"
        title="Agent Activity Timeline"
        subtitle="Every autonomous decision, in order"
      >
        <div className="space-y-2">
          {agentActivity.map((a, i) => (
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
              <span className="font-medium text-foreground/90 w-40 shrink-0">
                {a.agent}
              </span>
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
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
