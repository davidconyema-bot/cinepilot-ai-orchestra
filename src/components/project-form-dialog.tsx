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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Production, ProductionStatus } from "@/lib/store";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Production | null;
}

const statuses: ProductionStatus[] = [
  "Development",
  "Pre-Production",
  "In Production",
  "Post-Production",
];

export function ProjectFormDialog({ open, onOpenChange, editing }: Props) {
  const createProduction = useStore((s) => s.createProduction);
  const updateProduction = useStore((s) => s.updateProduction);

  const [form, setForm] = useState({
    title: "",
    director: "",
    producer: "",
    genre: "",
    budget: 0,
    startDate: "",
    endDate: "",
    description: "",
    status: "Development" as ProductionStatus,
  });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        director: editing.director,
        producer: editing.producer,
        genre: editing.genre,
        budget: editing.budget,
        startDate: editing.startDate,
        endDate: editing.endDate,
        description: editing.description,
        status: editing.status,
      });
    } else {
      setForm({
        title: "",
        director: "",
        producer: "",
        genre: "",
        budget: 0,
        startDate: "",
        endDate: "",
        description: "",
        status: "Development",
      });
    }
  }, [editing, open]);

  const submit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editing) {
      updateProduction(editing.id, form);
      toast.success(`${form.title} updated`);
    } else {
      createProduction(form);
      toast.success(`${form.title} created`, {
        description: "Producer Agent notified.",
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit production" : "New production"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Production name">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Neon Skyline"
            />
          </Field>
          <Field label="Genre">
            <Input
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              placeholder="Sci-Fi Thriller"
            />
          </Field>
          <Field label="Director">
            <Input
              value={form.director}
              onChange={(e) => setForm({ ...form, director: e.target.value })}
            />
          </Field>
          <Field label="Producer">
            <Input
              value={form.producer}
              onChange={(e) => setForm({ ...form, producer: e.target.value })}
            />
          </Field>
          <Field label="Budget (USD)">
            <Input
              type="number"
              value={form.budget || ""}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as ProductionStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Start date">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Logline, tone, and any production notes…"
              />
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{editing ? "Save changes" : "Create production"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
