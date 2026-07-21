import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { agents } from "@/lib/mock-data";
import { toast } from "sonner";

const suggestions = [
  "Move Scene 12 to Friday.",
  "Estimate the cost of adding another location.",
  "Generate tomorrow's call sheet.",
  "Find scheduling conflicts.",
  "Optimize production costs.",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandDock({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  async function submit(text: string) {
    if (!text.trim()) return;
    setRunning(true);
    setActiveAgents([]);
    const chain = ["producer", "schedule", "budget", "risk"];
    for (const id of chain) {
      await new Promise((r) => setTimeout(r, 500));
      setActiveAgents((a) => [...a, id]);
    }
    await new Promise((r) => setTimeout(r, 400));
    setRunning(false);
    toast.success("Producer Agent completed task", {
      description: `4 agents collaborated to resolve: "${text}"`,
    });
    setQuery("");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="fixed left-1/2 top-[15vh] z-50 w-[92vw] max-w-2xl -translate-x-1/2"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl glow-primary">
              <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold">
                  CinePilot Command
                </span>
                <span className="text-xs text-muted-foreground">
                  Producer Agent delegates to specialists
                </span>
                <button
                  onClick={() => onOpenChange(false)}
                  className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(query);
                }}
                className="p-4"
              >
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-white/5 px-3 py-2">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask CinePilot anything about your production…"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    disabled={running}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  >
                    <Send className="h-3 w-3" />
                    Send
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </form>

              {(running || activeAgents.length > 0) && (
                <div className="border-t border-border/40 p-4">
                  <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                    Agent Workflow
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {agents
                      .filter((a) =>
                        ["producer", "schedule", "budget", "risk"].includes(a.id)
                      )
                      .map((a, i) => {
                        const on = activeAgents.includes(a.id);
                        return (
                          <div key={a.id} className="flex items-center gap-2">
                            <motion.div
                              initial={{ opacity: 0.3, scale: 0.9 }}
                              animate={{
                                opacity: on ? 1 : 0.3,
                                scale: on ? 1 : 0.9,
                              }}
                              transition={{ duration: 0.3 }}
                              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                                on
                                  ? "border-primary/50 bg-primary/15"
                                  : "border-border/60 bg-white/5"
                              }`}
                            >
                              <span>{a.emoji}</span>
                              <span className="font-medium">{a.name}</span>
                            </motion.div>
                            {i < 3 && (
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
