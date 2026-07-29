import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { actorDocs, downloadPdf } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/documents")({
  component: ActorDocuments,
  head: () => ({
    meta: [
      { title: "Documents — CinePilot Actor Studio" },
      { name: "description", content: "Contracts, call sheets, wardrobe references and rehearsal notes." },
      { property: "og:title", content: "Documents — CinePilot Actor Studio" },
      { property: "og:description", content: "All your production paperwork, downloadable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ActorDocuments() {
  return (
    <>
      <PageHeader title="Documents" subtitle="Contracts, call sheets and production paperwork." />
      <SectionCard>
        <div className="grid gap-2 md:grid-cols-2">
          {actorDocs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-white/5 p-3">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{d.name}</div>
                <div className="text-[11px] text-muted-foreground">{d.size} · {d.updated}</div>
              </div>
              <Badge variant="outline" className="text-[10px]">{d.kind}</Badge>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  downloadPdf(d.name, d.name.replace(/\.pdf$/, ""), d.body);
                  toast.success("Download started");
                }}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
