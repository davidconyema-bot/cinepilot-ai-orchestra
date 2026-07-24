import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShootDay } from "@/lib/store";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: ShootDay | null;
}

export function ShootDayDialog({ open, onOpenChange, editing }: Props) {
  const productions = useStore((s) => s.productions);
  const addShootDay = useStore((s) => s.addShootDay);
  const updateShootDay = useStore((s) => s.updateShootDay);
  const [form, setForm] = useState({
    productionId: productions[0]?.id ?? "",
    date: "",
    scenes: "",
    location: "",
    actors: "",
    crew: 0,
    equipment: "",
    weather: "",
    duration: "10h",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        productionId: editing.productionId ?? productions[0]?.id ?? "",
        date: editing.date,
        scenes: editing.scenes.join(", "),
        location: editing.location,
        actors: editing.actors.join(", "),
        crew: editing.crew,
        equipment: editing.equipment,
        weather: editing.weather,
        duration: editing.duration,
      });
    } else {
      setForm({
        productionId: productions[0]?.id ?? "",
        date: "",
        scenes: "",
        location: "",
        actors: "",
        crew: 0,
        equipment: "",
        weather: "",
        duration: "10h",
      });
    }
  }, [editing, open, productions]);

  const submit = () => {
    if (!form.date || !form.location.trim()) {
      toast.error("Date and location are required");
      return;
    }
    const payload = {
      productionId: form.productionId || undefined,
      date: form.date,
      scenes: form.scenes.split(",").map((s) => s.trim()).filter(Boolean),
      location: form.location,
      actors: form.actors.split(",").map((s) => s.trim()).filter(Boolean),
      crew: form.crew,
      equipment: form.equipment,
      weather: form.weather,
      duration: form.duration,
      conflict: false,
    };
    if (editing) {
      updateShootDay(editing.id, payload);
      toast.success("Shoot day updated");
    } else {
      addShootDay(payload);
      toast.success("Shoot day added");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit shoot day" : "Add shoot day"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Production</Label>
            <Select
              value={form.productionId}
              onValueChange={(v) => setForm({ ...form, productionId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select production" />
              </SelectTrigger>
              <SelectContent>
                {productions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <F label="Date">
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </F>
          <F label="Duration">
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="12h"
            />
          </F>
          <F label="Location">
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </F>
          <F label="Weather">
            <Input
              value={form.weather}
              onChange={(e) => setForm({ ...form, weather: e.target.value })}
              placeholder="Clear, 72°F"
            />
          </F>
          <F label="Scenes (comma separated)">
            <Input
              value={form.scenes}
              onChange={(e) => setForm({ ...form, scenes: e.target.value })}
              placeholder="Sc. 12, Sc. 13"
            />
          </F>
          <F label="Actors (comma separated)">
            <Input
              value={form.actors}
              onChange={(e) => setForm({ ...form, actors: e.target.value })}
              placeholder="Elena K., Marcus V."
            />
          </F>
          <F label="Crew size">
            <Input
              type="number"
              value={form.crew || ""}
              onChange={(e) => setForm({ ...form, crew: Number(e.target.value) || 0 })}
            />
          </F>
          <F label="Equipment">
            <Input
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
            />
          </F>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{editing ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
