import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACTOR_THREADS, actorProfile, useActorStore } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/messages")({
  component: ActorMessages,
  head: () => ({
    meta: [
      { title: "Production Messages — CinePilot Actor Studio" },
      { name: "description", content: "Message the director, producer, AD and screenwriter." },
      { property: "og:title", content: "Production Messages — CinePilot Actor Studio" },
      { property: "og:description", content: "Your direct line to the production team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ActorMessages() {
  const { messages, sendMessage } = useActorStore();
  const [thread, setThread] = useState(ACTOR_THREADS[0].id);
  const [draft, setDraft] = useState("");
  const list = messages.filter((m) => m.thread === thread);

  return (
    <>
      <PageHeader title="Production Messages" subtitle="Direct conversations with your production team." />
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <SectionCard title="Conversations">
          <div className="space-y-1.5">
            {ACTOR_THREADS.map((t) => (
              <button
                key={t.id}
                onClick={() => setThread(t.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                  thread === t.id ? "bg-primary/20" : "hover:bg-white/5"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-semibold text-primary-foreground">
                  {t.id.split(" ").map((p) => p[0]).join("")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate">{t.id}</span>
                  <span className="block text-[10px] text-muted-foreground">{t.role}</span>
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="p-0 overflow-hidden">
          <div className="border-b border-border/40 p-3">
            <span className="text-sm font-medium">{thread}</span>
            <Badge variant="outline" className="ml-2 text-[10px]">
              {ACTOR_THREADS.find((t) => t.id === thread)?.role}
            </Badge>
          </div>
          <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
            {list.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "me"
                      ? "bg-primary/20 text-foreground"
                      : "border border-border/50 bg-white/5"
                  }`}
                >
                  <div className="text-[10px] text-muted-foreground">
                    {m.from === "me" ? actorProfile.name : m.from} · {m.time}
                  </div>
                  {m.body}
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No messages yet.</p>
            )}
          </div>
          <div className="flex items-end gap-2 border-t border-border/40 p-3">
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (draft.trim()) { sendMessage(thread, draft.trim()); setDraft(""); }
                }
              }}
              placeholder={`Message ${thread}`}
              className="min-h-10 flex-1 resize-none rounded-lg border border-border/60 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
            <Button
              className="h-10 gap-2"
              onClick={() => {
                if (!draft.trim()) return;
                sendMessage(thread, draft.trim());
                setDraft("");
              }}
            >
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
