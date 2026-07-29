import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { useActorStore } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/notes")({
  component: DirectorNotes,
  head: () => ({
    meta: [
      { title: "Director Notes — CinePilot Actor Studio" },
      { name: "description", content: "Notes from your director, by scene and priority." },
      { property: "og:title", content: "Director Notes — CinePilot Actor Studio" },
      { property: "og:description", content: "Track and complete every performance note." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function DirectorNotes() {
  const { notes, toggleNote } = useActorStore();
  return (
    <>
      <PageHeader title="Director Notes" subtitle="Performance notes sent straight from the director." />
      <SectionCard>
        <div className="space-y-2">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => toggleNote(n.id)}
              className="flex w-full items-start gap-3 rounded-xl border border-border/50 bg-white/5 p-3 text-left hover:bg-white/10"
            >
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${n.done ? "text-success" : "text-muted-foreground"}`}
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{n.scene}</span>
                  <Badge variant="outline" className="text-[10px]">{n.priority} priority</Badge>
                  <span className="text-[10px] text-muted-foreground">{n.date} · {n.from}</span>
                </div>
                <p className={`mt-0.5 text-xs ${n.done ? "text-muted-foreground line-through" : "text-foreground/85"}`}>
                  {n.comment}
                </p>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
