import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { agents } from "@/lib/mock-data";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/command")({
  component: CommandCenter,
  head: () => ({
    meta: [
      { title: "AI Command Center — CinePilot AI" },
      { name: "description", content: "Delegate any production task to the Producer Agent." },
    ],
  }),
});

const suggestions = [
  "Move Scene 12 to Friday.",
  "Estimate the cost of adding another location.",
  "Generate tomorrow's call sheet.",
  "Find scheduling conflicts.",
  "Optimize production costs.",
  "Draft a shot list for the rooftop chase.",
];

interface Msg {
  role: "user" | "producer";
  text: string;
  chain?: string[];
}

function CommandCenter() {
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "producer",
      text: "Standing by. I'll delegate any request to my specialist agents and return with results.",
    },
  ]);
  const [running, setRunning] = useState<string[]>([]);

  async function submit(text: string) {
    if (!text.trim()) return;
    setQ("");
    setMessages((m) => [...m, { role: "user", text }]);
    setRunning([]);
    const chain = ["producer", "schedule", "budget", "risk"];
    for (const id of chain) {
      await new Promise((r) => setTimeout(r, 550));
      setRunning((r) => [...r, id]);
    }
    await new Promise((r) => setTimeout(r, 400));
    setMessages((m) => [
      ...m,
      {
        role: "producer",
        text: `Coordinated with 3 specialist agents. Proposed plan is ready — Scheduling Agent identified a Friday slot, Budget Agent projects +$8,400, Risk Agent flags no conflicts.`,
        chain,
      },
    ]);
    setRunning([]);
    toast.success("Task completed", { description: "4 agents collaborated." });
  }

  return (
    <>
      <PageHeader
        title="AI Command Center"
        subtitle="Talk to the Producer Agent. Watch it delegate to specialists in real time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2 flex flex-col min-h-[560px]"
          title="Conversation"
          subtitle="Producer Agent · orchestrator"
        >
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass border border-border/60"
                  }`}
                >
                  {m.role === "producer" && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-primary">
                      <span>🎬</span>
                      <span className="font-medium">Producer Agent</span>
                    </div>
                  )}
                  <div>{m.text}</div>
                  {m.chain && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {m.chain.map((id, j) => {
                        const a = agents.find((x) => x.id === id);
                        if (!a) return null;
                        return (
                          <span key={id} className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                              {a.emoji} {a.name}
                            </span>
                            {j < m.chain!.length - 1 && (
                              <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {running.length > 0 && (
              <div className="glass rounded-2xl border border-primary/30 p-3">
                <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  Delegating…
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {["producer", "schedule", "budget", "risk"].map((id, i) => {
                    const a = agents.find((x) => x.id === id)!;
                    const on = running.includes(id);
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            opacity: on ? 1 : 0.3,
                            scale: on ? 1 : 0.95,
                          }}
                          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                            on
                              ? "border-primary/50 bg-primary/15"
                              : "border-border/60 bg-white/5"
                          }`}
                        >
                          <span>{a.emoji}</span>
                          <span>{a.name}</span>
                          {on && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          )}
                        </motion.div>
                        {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(q);
            }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-white/5 px-3 py-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask CinePilot anything…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Send className="h-3 w-3" />
              Send
            </button>
          </form>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Suggested prompts">
            <div className="space-y-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="w-full text-left rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 hover:border-primary/40 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Specialist roster" subtitle="Available to Producer">
            <div className="space-y-1.5">
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
        </div>
      </div>
    </>
  );
}
