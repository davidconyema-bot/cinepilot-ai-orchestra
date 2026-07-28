import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Pencil, Plus, Trash2, Upload, Users, Film } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useStore, type Production } from "@/lib/store";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { ScriptUploadDialog } from "@/components/script-upload-dialog";
import { firebaseEnabled } from "@/lib/firebase";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Projects — CinePilot AI" },
      { name: "description", content: "Manage productions, screenplays, crew and assets." },
    ],
  }),
});

function Projects() {
  const productions = useStore((s) => s.productions);
  const scripts = useStore((s) => s.scripts);
  const deleteProduction = useStore((s) => s.deleteProduction);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Production | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | undefined>();

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Production) => {
    setEditing(p);
    setFormOpen(true);
  };
  const openUpload = (id?: string) => {
    setUploadTarget(id);
    setUploadOpen(true);
  };
  const remove = (p: Production) => {
    if (confirm(`Delete "${p.title}"? This cannot be undone.`)) {
      deleteProduction(p.id);
      toast.success(`${p.title} deleted`);
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Every production, screenplay, and crew — one workspace, orchestrated by AI."
        action={
          <div className="flex items-center gap-2">
            {!firebaseEnabled && (
              <Badge variant="outline" className="border-warning/40 text-warning text-[10px]">
                Local storage
              </Badge>
            )}
            <Button onClick={() => openUpload()} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Upload script
            </Button>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> New production
            </Button>
          </div>
        }
      />

      <SectionCard className="mb-6" title="Screenplay uploads" subtitle="Vertex AI script analysis">
        {scripts.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No scripts uploaded yet. Click <span className="text-foreground">Upload script</span> to
            simulate a Vertex AI analysis run.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {scripts.map((s) => {
              const p = productions.find((x) => x.id === s.productionId);
              return (
                <div key={s.id} className="rounded-xl border border-border/40 bg-white/5 p-3">
                  <div className="text-sm font-medium truncate">{s.fileName}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {p?.title ?? "Unassigned"} · {new Date(s.uploadedAt).toLocaleDateString()}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px]">
                    <Stat label="Scenes" value={s.scenes} />
                    <Stat label="Chars" value={s.characters} />
                    <Stat label="Loc" value={s.locations} />
                    <Stat label="Props" value={s.props} />
                    <Stat label="Costumes" value={s.costumes} />
                    <Stat label="Runtime" value={`${s.runtimeMinutes}m`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {productions.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Film className="mx-auto h-10 w-10 text-muted-foreground" />
          <div className="mt-3 font-display text-lg font-semibold">No productions yet</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first production to get started.
          </p>
          <Button onClick={openNew} className="mt-4 gap-2">
            <Plus className="h-4 w-4" /> New production
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productions.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
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
                      {p.genre || "—"} · dir. {p.director || "—"}
                    </div>
                    {p.description && (
                      <div className="text-[11px] text-muted-foreground mt-1 max-w-md line-clamp-2">
                        {p.description}
                      </div>
                    )}
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
                <Stat label="Scenes" value={p.scenes} />
                <Stat label="Crew" value={p.crew} />
                <Stat label="Budget" value={`$${(p.budget / 1_000_000).toFixed(1)}M`} />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate max-w-[180px]">{p.script ?? "No script"}</span>
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

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openUpload(p.id)}>
                  <Upload className="h-3.5 w-3.5" /> Script
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => remove(p)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ScriptUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} defaultProductionId={uploadTarget} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white/5 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-semibold">{value}</div>
    </div>
  );
}
