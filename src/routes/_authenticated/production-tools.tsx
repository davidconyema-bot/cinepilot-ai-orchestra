import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, Loader2, Plus, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import replitLogo from "@/assets/logos/replit.svg";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useToolsStore } from "@/lib/tools-store";
import { trackEvent } from "@/services/analytics";
import {
  REPLIT_AGENT,
  buildProductionContext,
  detectProductionTool,
  fetchReplitStatus,
  requestProductionTool,
  type ReplitStatus,
} from "@/services/replitAgentService";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/production-tools")({
  component: ProductionToolsPage,
  head: () => ({
    meta: [
      { title: "Production Tools — CinePilot AI" },
      {
        name: "description",
        content:
          "Turn production requests into lightweight crew utilities with the Replit Production Tools Agent.",
      },
      { property: "og:title", content: "Production Tools — CinePilot AI" },
      {
        property: "og:description",
        content: "Lightweight production utilities built by the Replit Production Tools Agent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const EXAMPLES = [
  "Create a crew check-in portal for tomorrow's shoot.",
  "Build a props inventory tracker for this production.",
  "Create a location scouting form for the locations department.",
  "Create an equipment checkout tracker.",
  "Create a simple portal where actors can confirm their call times.",
];

const statusStyle: Record<string, string> = {
  ready: "border-success/40 text-success",
  pending: "border-warning/40 text-warning",
  failed: "border-destructive/40 text-destructive",
};

function ProductionToolsPage() {
  const productions = useStore((s) => s.productions);
  const shootDays = useStore((s) => s.shootDays);
  const addAgentLog = useStore((s) => s.addAgentLog);
  const tools = useToolsStore((s) => s.tools);
  const addTool = useToolsStore((s) => s.addTool);

  const [productionId, setProductionId] = useState(productions[0]?.id ?? "");
  const [request, setRequest] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<ReplitStatus | null>(null);

  useEffect(() => {
    fetchReplitStatus().then(setStatus);
  }, []);

  useEffect(() => {
    if (!productionId && productions[0]) setProductionId(productions[0].id);
  }, [productions, productionId]);

  const production = productions.find((p) => p.id === productionId);
  const nextDay =
    shootDays.find((d) => (!d.productionId || d.productionId === productionId)) ?? null;

  async function submit(text: string) {
    if (!text.trim() || busy) return;
    const blueprint = detectProductionTool(text);
    if (!blueprint) {
      toast.info("That request isn't a production utility", {
        description: "The Producer Agent will keep it with the core CinePilot agents.",
      });
      return;
    }
    setBusy(true);
    addAgentLog({
      agent: "Producer Agent",
      action: `Delegated "${blueprint.toolName}" to the Replit Production Tools Agent`,
      status: "running",
    });
    const started = Date.now();
    const context = buildProductionContext(production, nextDay);
    const result = await requestProductionTool({ ...blueprint, context });
    const durationMs = Date.now() - started;

    addTool({
      name: blueprint.toolName,
      toolType: blueprint.toolType,
      department: blueprint.department,
      production: context.production,
      purpose: blueprint.purpose,
      status: result.status,
      url: result.url,
      message: result.message,
    });

    addAgentLog({
      agent: "Replit Agent",
      action: `${result.ok ? "Production tool created" : "Production tool request failed"} — ${blueprint.toolName} (${context.production} · ${blueprint.department})`,
      status: result.ok ? "completed" : "failed",
    });

    trackEvent("replit_production_tool", {
      tool: blueprint.toolName,
      toolType: blueprint.toolType,
      department: blueprint.department,
      production: context.production,
      status: result.status,
      durationMs,
      error: result.ok ? undefined : result.message,
    });

    if (result.ok) toast.success("Production tool created", { description: result.message });
    else toast.error("Replit Production Tools is currently unavailable", { description: result.message });

    setRequest("");
    setBusy(false);
  }

  const unavailable = status && status.state !== "connected";

  return (
    <>
      <PageHeader
        title="Production Tools"
        subtitle="Turn production requests into lightweight utilities for crews and departments."
        action={
          <Badge variant="outline" className="gap-2 border-border/60">
            <img src={replitLogo} alt="Replit logo" className="h-3.5 w-3.5" />
            Powered by Replit Agent
          </Badge>
        }
      />

      {unavailable && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <div className="font-medium">Replit Production Tools is currently unavailable.</div>
            <p className="mt-1 text-muted-foreground">{status?.message}</p>
            <p className="mt-1 text-muted-foreground">
              All other CinePilot capabilities — screenplay analysis, scheduling, budgeting, risk,
              reports, analytics and collaboration — remain fully available.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Create Production Tool"
          subtitle="Describe what your crew needs — the Producer Agent decides whether to delegate to Replit."
        >
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Production
                <select
                  value={productionId}
                  onChange={(e) => setProductionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border/60 bg-white/5 px-3 py-2 text-sm text-foreground outline-none"
                >
                  {productions.length === 0 && <option value="">No productions yet</option>}
                  {productions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="text-xs text-muted-foreground">
                Context sent to Replit
                <div className="mt-1 rounded-lg border border-border/60 bg-white/5 px-3 py-2 font-mono text-[11px] text-foreground/80">
                  {JSON.stringify(buildProductionContext(production, nextDay))}
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(request);
              }}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-white/5 px-3 py-2"
            >
              <Wrench className="h-4 w-4 text-primary" />
              <input
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g. Create a crew check-in portal for tomorrow's shoot."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button type="submit" size="sm" disabled={busy} className="gap-1">
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                Create
              </Button>
            </form>

            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => submit(e)}
                  className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Replit Production Tools Agent" subtitle="Provider: Replit · Technology: Replit Agent">
          <div className="flex items-center gap-3">
            <img src={replitLogo} alt="Replit official logo" className="h-9 w-9" />
            <div>
              <div className="font-display font-semibold">{REPLIT_AGENT.name}</div>
              <div className="text-xs text-muted-foreground">{REPLIT_AGENT.category}</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{REPLIT_AGENT.description}</p>
          <Badge
            variant="outline"
            className={`mt-3 ${status?.state === "connected" ? "border-success/40 text-success" : "border-warning/40 text-warning"}`}
          >
            {status?.state === "connected" ? "Connected / Ready" : "Integration Ready"}
          </Badge>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {REPLIT_AGENT.capabilities.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        className="mt-4"
        title="Active Tools"
        subtitle="Recently created production utilities · Built with Replit Agent"
      >
        {tools.length === 0 ? (
          <div className="flex h-28 items-center justify-center text-xs text-muted-foreground">
            No production tools yet.
          </div>
        ) : (
          <div className="space-y-2">
            {tools.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border/40 bg-white/5 px-3 py-2 text-sm"
              >
                <img src={replitLogo} alt="" className="h-4 w-4" aria-hidden="true" />
                <div className="min-w-[170px] flex-1">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.purpose}</div>
                </div>
                <span className="text-xs text-muted-foreground">{t.production}</span>
                <span className="text-xs text-muted-foreground">{t.department}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
                <Badge variant="outline" className={statusStyle[t.status]}>
                  {t.status}
                </Badge>
                {t.url ? (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Open Tool <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">No deployment</span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}
