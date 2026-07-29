import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadPdf, useActorStore } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/scripts")({
  component: MyScripts,
  head: () => ({
    meta: [
      { title: "My Scripts — CinePilot Actor Studio" },
      {
        name: "description",
        content: "Your script library: revisions, scene pages, reading status and PDF downloads.",
      },
      { property: "og:title", content: "My Scripts — CinePilot Actor Studio" },
      { property: "og:description", content: "Read, download and track every script revision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function MyScripts() {
  const { scripts, markScriptRead } = useActorStore();
  const [open, setOpen] = useState<string | null>(null);
  const active = scripts.find((s) => s.id === open);

  return (
    <>
      <PageHeader title="My Scripts" subtitle="Every page assigned to you, always at the latest revision." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Script library">
          <div className="space-y-2">
            {scripts.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white/5 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {s.movie} · {s.scene}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Revision {s.revision} · updated {s.updated}
                  </div>
                </div>
                <Badge variant="outline" className={s.read ? "border-success/40 text-success" : ""}>
                  {s.read ? "Read" : "Unread"}
                </Badge>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(s.id)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => {
                      downloadPdf(`${s.movie}_${s.scene}`.replace(/\s+/g, "_"), `${s.movie} — ${s.scene}`, s.body);
                      toast.success("Script downloaded");
                    }}
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    disabled={s.read}
                    onClick={() => {
                      markScriptRead(s.id);
                      toast.success("Marked as read");
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Read
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={active ? `${active.movie} · ${active.scene}` : "Script viewer"}>
          {active ? (
            <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap font-mono text-xs text-foreground/85">
              {active.body}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">Select “View” on a script to read it here.</p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
