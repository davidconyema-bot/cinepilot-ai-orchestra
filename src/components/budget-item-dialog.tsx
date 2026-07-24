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
import type { BudgetItem } from "@/lib/store";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: BudgetItem | null;
}

export function BudgetItemDialog({ open, onOpenChange, editing }: Props) {
  const addBudgetItem = useStore((s) => s.addBudgetItem);
  const updateBudgetItem = useStore((s) => s.updateBudgetItem);
  const [form, setForm] = useState({ category: "", description: "", amount: 0 });

  useEffect(() => {
    if (editing) {
      setForm({
        category: editing.category,
        description: editing.description,
        amount: editing.amount,
      });
    } else {
      setForm({ category: "", description: "", amount: 0 });
    }
  }, [editing, open]);

  const submit = () => {
    if (!form.category.trim() || form.amount <= 0) {
      toast.error("Category and amount are required");
      return;
    }
    if (editing) {
      updateBudgetItem(editing.id, form);
      toast.success("Expense updated");
    } else {
      addBudgetItem(form);
      toast.success("Expense added");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit expense" : "Add expense"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Equipment"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Camera & lens rentals"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Amount (USD)</Label>
            <Input
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })}
            />
          </div>
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
