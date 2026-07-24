import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { useStore, timeAgo } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: Reports,
  head: () => ({
    meta: [
      { title: "Reports — CinePilot AI" },
      {
        name: "description",
        content: "Auto-generated production reports, exportable to PDF, CSV, JSON.",
      },
    ],
  }),
});

function Reports() {
  const productions = useStore((s) => s.productions);
  const budgetItems = useStore((s) => s.budgetItems);
  const shootDays = useStore((s) => s.shootDays);
  const scripts = useStore((s) => s.scripts);
  const notifications = useStore((s) => s.notifications);

  const totalBudget = budgetItems.reduce((s, b) => s + b.amount, 0);
  const lastNotif = notifications[0];
  const lastUpdated = lastNotif ? timeAgo(lastNotif.createdAt) : "just now";

  const reports = [
    {
      id: "r1",
      name: "Scene Breakdown",
      description: `${scripts.reduce((s, x) => s + x.scenes, 0)} scenes across ${scripts.length} script${scripts.length === 1 ? "" : "s"}`,
      updated: lastUpdated,
      payload: scripts,
    },
    {
      id: "r2",
      name: "Shooting Order",
      description: `${shootDays.length} shoot days · ${shootDays.filter((d) => d.conflict).length} conflicts`,
      updated: lastUpdated,
      payload: shootDays,
    },
    {
      id: "r3",
      name: "Daily Call Sheet",
      description: `Next: ${shootDays[0]?.date ?? "—"} · ${shootDays[0]?.location ?? "—"}`,
      updated: lastUpdated,
      payload: shootDays.slice(0, 1),
    },
    {
      id: "r4",
      name: "Crew Report",
      description: `${productions.reduce((s, p) => s + p.crew, 0)} crew across ${productions.length} production${productions.length === 1 ? "" : "s"}`,
      updated: lastUpdated,
      payload: productions.map((p) => ({ title: p.title, crew: p.crew })),
    },
    {
      id: "r5",
      name: "Budget Report",
      description: `$${(totalBudget / 1_000_000).toFixed(2)}M across ${budgetItems.length} line items`,
      updated: lastUpdated,
      payload: budgetItems,
    },
    {
      id: "r6",
      name: "Production Summary",
      description: `${productions.length} productions · avg ${
        productions.length
          ? Math.round(productions.reduce((s, p) => s + p.progress, 0) / productions.length)
          : 0
      }% progress`,
      updated: lastUpdated,
      payload: productions,
    },
  ];

  const download = (name: string, ext: string, data: string, mime: string) => {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_").toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${name} exported to ${ext.toUpperCase()}`);
  };

  const toCsv = (rows: unknown[]) => {
    if (rows.length === 0) return "no data";
    const keys = Object.keys(rows[0] as object);
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    return [
      keys.join(","),
      ...rows.map((r) => keys.map((k) => escape((r as Record<string, unknown>)[k])).join(",")),
    ].join("\n");
  };

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Auto-generated from your live production data. Updates whenever projects change."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-5 hover:border-primary/40 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Updated {r.updated}
              </span>
            </div>
            <div className="mt-3 font-display text-base font-semibold">{r.name}</div>
            <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>

            <div className="mt-4 flex gap-1.5">
              <button
                onClick={() =>
                  download(
                    r.name,
                    "txt",
                    `${r.name}\n\n${r.description}\n\n${JSON.stringify(r.payload, null, 2)}`,
                    "text/plain"
                  )
                }
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border/60 bg-white/5 px-2 py-1.5 text-[11px] hover:bg-white/10 transition"
              >
                <Download className="h-3 w-3" /> PDF
              </button>
              <button
                onClick={() => download(r.name, "csv", toCsv(r.payload as unknown[]), "text/csv")}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border/60 bg-white/5 px-2 py-1.5 text-[11px] hover:bg-white/10 transition"
              >
                <FileSpreadsheet className="h-3 w-3" /> CSV
              </button>
              <button
                onClick={() =>
                  download(r.name, "json", JSON.stringify(r.payload, null, 2), "application/json")
                }
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border/60 bg-white/5 px-2 py-1.5 text-[11px] hover:bg-white/10 transition"
              >
                <FileJson className="h-3 w-3" /> JSON
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <SectionCard
        className="mt-6"
        title="Data pipeline"
        subtitle="Reports refresh whenever your live data changes"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {[
            ["Store", `${productions.length} productions · ${shootDays.length} shoot days`],
            ["Budget", `${budgetItems.length} line items · $${(totalBudget / 1000).toFixed(0)}k`],
            ["Scripts", `${scripts.length} parsed screenplays`],
            ["Alerts", `${notifications.filter((n) => n.unread).length} unread notifications`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border/40 bg-white/5 p-3">
              <div className="text-primary font-medium">{k}</div>
              <div className="mt-1 text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
