import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, MapPin, Pencil, Plus, Trash2, Users, Cloud } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShootDayDialog } from "@/components/shoot-day-dialog";
import { useStore, type ShootDay } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/schedule")({
  component: Schedule,
  head: () => ({
    meta: [
      { title: "Schedule — CinePilot AI" },
      {
        name: "description",
        content: "Interactive shoot day calendar with conflicts and weather.",
      },
    ],
  }),
});

function Schedule() {
  const shootDays = useStore((s) => s.shootDays);
  const productions = useStore((s) => s.productions);
  const scripts = useStore((s) => s.scripts);
  const addShootDay = useStore((s) => s.addShootDay);
  const updateShootDay = useStore((s) => s.updateShootDay);
  const deleteShootDay = useStore((s) => s.deleteShootDay);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShootDay | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const generateFromScript = () => {
    if (scripts.length === 0) {
      toast.error("Upload a script first");
      return;
    }
    const script = scripts[0];
    const prod = productions.find((p) => p.id === script.productionId);
    const start = prod?.startDate ? new Date(prod.startDate) : new Date();
    const count = Math.max(5, Math.min(20, Math.floor(script.scenes / 8)));
    for (let i = 0; i < count; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      addShootDay({
        productionId: script.productionId,
        date: d.toISOString().slice(0, 10),
        scenes: [`Sc. ${i * 3 + 1}`, `Sc. ${i * 3 + 2}`],
        location: ["Sound Stage 4", "Downtown", "Warehouse", "Rooftop", "Beach"][i % 5],
        actors: ["Elena K.", "Marcus V."],
        crew: 30 + Math.floor(Math.random() * 20),
        equipment: "Alexa Mini LF, Steadicam",
        weather: "Clear",
        duration: "10h",
        conflict: Math.random() > 0.75,
      });
    }
    toast.success(`Generated ${count} shoot days from ${script.fileName}`);
  };

  const remove = (d: ShootDay) => {
    if (confirm(`Delete shoot day on ${d.date}?`)) {
      deleteShootDay(d.id);
      toast.success("Shoot day deleted");
    }
  };

  const onDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) return;
    const src = shootDays.find((d) => d.id === dragging);
    const tgt = shootDays.find((d) => d.id === targetId);
    if (!src || !tgt) return;
    const srcDate = src.date;
    updateShootDay(src.id, { date: tgt.date });
    updateShootDay(tgt.id, { date: srcDate });
    setDragging(null);
    toast.success("Shoot days swapped — reports updated");
  };

  const conflictCount = shootDays.filter((d) => d.conflict).length;

  return (
    <>
      <PageHeader
        title="Production Schedule"
        subtitle="Drag-and-drop shoot days to swap dates. Changes propagate to reports and notifications."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateFromScript}>
              Generate from script
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add shoot day
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        <SectionCard title="Shoot days" subtitle="Total scheduled">
          <div className="font-display text-3xl font-semibold">{shootDays.length}</div>
        </SectionCard>
        <SectionCard title="Conflicts" subtitle="Detected">
          <div
            className={`font-display text-3xl font-semibold ${
              conflictCount > 0 ? "text-destructive" : "text-success"
            }`}
          >
            {conflictCount}
          </div>
        </SectionCard>
        <SectionCard title="Total crew" subtitle="Sum across all days">
          <div className="font-display text-3xl font-semibold">
            {shootDays.reduce((s, d) => s + d.crew, 0)}
          </div>
        </SectionCard>
        <SectionCard title="Locations" subtitle="Unique">
          <div className="font-display text-3xl font-semibold">
            {new Set(shootDays.map((d) => d.location)).size}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Shooting board" subtitle="Drag a day onto another to swap dates">
        {shootDays.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
            No shoot days scheduled. Add one or generate from an uploaded script.
          </div>
        ) : (
          <div className="space-y-3">
            {shootDays.map((d, i) => (
              <motion.div
                key={d.id}
                draggable
                onDragStart={() => setDragging(d.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(d.id)}
                onDragEnd={() => setDragging(null)}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-xl border p-4 cursor-grab active:cursor-grabbing transition ${
                  dragging === d.id
                    ? "opacity-50 border-primary/60"
                    : d.conflict
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border/40 bg-white/5 hover:border-primary/30"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase">
                        {new Date(d.date).toLocaleDateString("en", { weekday: "short" })}
                      </div>
                      <div className="font-display text-2xl font-semibold">
                        {new Date(d.date).getDate()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(d.date).toLocaleDateString("en", { month: "short" })}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {d.scenes.map((s) => (
                          <Badge
                            key={s}
                            variant="outline"
                            className="border-primary/40 text-primary"
                          >
                            {s}
                          </Badge>
                        ))}
                        {d.conflict && (
                          <Badge className="bg-destructive/20 text-destructive border-0 gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Conflict
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> {d.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" /> {d.crew} crew
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {d.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Cloud className="h-3 w-3" /> {d.weather}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {d.actors.map((a) => (
                          <span
                            key={a}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(d);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => remove(d)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </SectionCard>

      <ShootDayDialog open={open} onOpenChange={setOpen} editing={editing} />
    </>
  );
}
