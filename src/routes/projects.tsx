import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cloud, FileText, Plus, Upload, Users, Film, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { productions } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Projects — CinePilot AI" },
      { name: "description", content: "Manage productions, screenplays, crew and assets." },
    ],
  }),
});

function Projects() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Every production, screenplay, and crew — one workspace, orchestrated by AI."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
            <Plus className="h-4 w-4" />
            New production
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            toast.success("Screenplay uploaded", {
              description: "Vertex AI is parsing scenes, characters, and locations.",
            });
          }}
          className={`lg:col-span-2 glass rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragOver ? "border-primary bg-primary/5" : "border-border/60"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-3 font-display text-lg font-semibold">
            Drop a screenplay to begin
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF, DOCX or TXT — up to 40MB. Script Analyst Agent will break it down automatically.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-info/40 text-info gap-1.5">
              <Cloud className="h-3 w-3" /> Google Cloud Storage Upload
            </Badge>
            <Badge variant="outline" className="border-primary/40 text-primary gap-1.5">
              <Sparkles className="h-3 w-3" /> Vertex AI Script Analysis
            </Badge>
          </div>
        </div>

        <SectionCard title="Screenplay Metadata" subtitle="Neon Skyline v4.2">
          <dl className="space-y-2 text-sm">
            {[
              ["Title", "Neon Skyline"],
              ["Format", "PDF · 118 pages"],
              ["Scenes", "142"],
              ["Characters", "18"],
              ["Locations", "9"],
              ["Est. Runtime", "112 min"],
              ["Last Parse", "2h ago"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {productions.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 hover:border-primary/40 transition group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30">
                  <Film className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.genre} · dir. {p.director}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  p.status === "In Production"
                    ? "border-success/40 text-success"
                    : p.status === "Pre-Production"
                    ? "border-info/40 text-info"
                    : p.status === "Post-Production"
                    ? "border-accent/40 text-accent"
                    : "border-warning/40 text-warning"
                }
              >
                {p.status}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{p.progress}%</span>
              </div>
              <Progress value={p.progress} className="h-2" />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              <Stat label="Days" value={`${p.completedDays}/${p.shootDays}`} />
              <Stat label="Scenes" value={p.scenes.toString()} />
              <Stat label="Crew" value={p.crew.toString()} />
              <Stat label="Revs" value={p.revisions.toString()} />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                <span className="truncate max-w-[180px]">{p.script}</span>
                <Badge
                  variant="outline"
                  className={`ml-1 ${
                    p.scriptStatus === "Parsed"
                      ? "border-success/40 text-success"
                      : p.scriptStatus === "Analyzing"
                      ? "border-info/40 text-info"
                      : "border-warning/40 text-warning"
                  }`}
                >
                  {p.scriptStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {p.crew}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-semibold">{value}</div>
    </div>
  );
}
