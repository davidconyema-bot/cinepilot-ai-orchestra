import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Play, Wrench } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { agents } from "@/lib/mock-data";
import { useStore, timeAgo } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/agents")({
  component: AgentCenter,
  head: () => ({
    meta: [
      { title: "AI Operations Center — CinePilot AI" },
      { name: "description", content: "Live view of autonomous production agents." },
    ],
  }),
});

const statusStyle: Record<string, string> = {
  running: "border-info/40 text-info",
  completed: "border-success/40 text-success",
  idle: "border-border/60 text-muted-foreground",
};

function AgentCenter() {
  const runtimes = useStore((s) => s.agentRuntimes);
  const runAnalysis = useStore((s) => s.runAnalysis);
  const logs = useStore((s) => s.agentLogs);
  const [running, setRunning] = useState(false);

  const start = async () => {
    setRunning(true);
    await runAnalysis();
    setRunning(false);
  };

  return (
    <>
      <PageHeader
        title="AI Operations Center"
        subtitle="Nine autonomous agents, one Producer. Click Run Analysis to trigger a coordinated pass."
        action={
          <div className="flex items-center gap-2">
            <Badge className="gap-1.5 bg-success/20 text-success border-success/30">
              <Activity className="h-3 w-3" /> Orchestrator online
            </Badge>
            <Button onClick={start} disabled={running} className="gap-2">
              <Play className="h-4 w-4" />
              {running ? "Running…" : "Run analysis"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((a, i) => {
          const rt = runtimes[a.id];
          const status = rt?.status ?? "idle";
          const progress = rt?.progress ?? 0;
          return (
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
                  <motion.div
                    animate={
                      status === "running"
                        ? { scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }
                        : {}
                    }
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                    style={{
                      background: `color-mix(in oklab, ${a.color} 20%, transparent)`,
                    }}
                  >
                    {a.emoji}
                  </motion.div>
                  <div>
                    <div className="font-display font-semibold">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.role}</div>
                  </div>
                </div>
                <Badge variant="outline" className={statusStyle[status]}>
                  <span
                    className={`mr-1 h-1.5 w-1.5 rounded-full ${
                      status === "running"
                        ? "bg-info animate-pulse"
                        : status === "completed"
                          ? "bg-success"
                          : "bg-muted-foreground"
                    }`}
                  />
                  {status}
                </Badge>
              </div>

              <div className="relative mt-4">
                <div className="text-xs text-muted-foreground">Current task</div>
                <div className="mt-0.5 text-sm">{a.currentTask}</div>
              </div>

              <div className="relative mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
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
          );
        })}
      </div>

      <SectionCard
        className="mt-6"
        title="Agent Activity Timeline"
        subtitle="Live log of every autonomous decision"
      >
        {logs.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
            No activity yet — click <span className="mx-1 text-foreground">Run analysis</span> to begin.
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {logs.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-muted-foreground w-14">{a.time}</span>
                <span className="font-medium text-foreground/90 w-40 shrink-0 capitalize">
                  {a.agent}
                </span>
                <span className="flex-1 text-muted-foreground truncate">{a.action}</span>
                <Badge
                  variant="outline"
                  className={
                    a.status === "completed" || a.status === "done"
                      ? "border-success/40 text-success"
                      : a.status === "running"
                        ? "border-info/40 text-info"
                        : a.status === "failed"
                          ? "border-destructive/40 text-destructive"
                          : "border-warning/40 text-warning"
                  }
                >
                  {a.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}
