import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultProductionId?: string;
}

export function ScriptUploadDialog({ open, onOpenChange, defaultProductionId }: Props) {
  const productions = useStore((s) => s.productions);
  const uploadScript = useStore((s) => s.uploadScript);

  const [productionId, setProductionId] = useState(defaultProductionId ?? productions[0]?.id ?? "");
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const onFile = (f: File | null) => {
    if (!f) return;
    setFileName(f.name);
  };

  const handleUpload = async () => {
    if (!productionId || !fileName) {
      toast.error("Choose a production and file");
      return;
    }
    setBusy(true);
    setProgress(0);
    const meta = await uploadScript(productionId, fileName, setProgress);
    toast.success(`Script parsed — ${meta.scenes} scenes, ${meta.characters} characters`);
    setBusy(false);
    onOpenChange(false);
    setFileName("");
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload screenplay</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Attach to production</Label>
            <Select value={productionId} onValueChange={setProductionId}>
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

          <label className="block cursor-pointer">
            <div className="rounded-xl border-2 border-dashed border-border/60 bg-white/5 p-6 text-center hover:border-primary/40 transition">
              <Upload className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-2 text-sm font-medium">
                {fileName || "Click to choose PDF, DOCX, or TXT"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Vertex AI will parse scenes, characters, locations, props, costumes
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {busy && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Uploading & analyzing…</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={busy || !fileName}>
            {busy ? "Uploading…" : "Upload & analyze"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
