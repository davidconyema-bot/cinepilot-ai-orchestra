import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Film,
  Bot,
  CalendarDays,
  Wallet,
  FileText,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  MapPin,
  Shirt,
  Boxes,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import googleCloudLogo from "@/assets/logos/google-cloud.svg";
import ibmLogo from "@/assets/logos/ibm.svg";
import grafanaLogo from "@/assets/logos/grafana.svg";
import clickhouseLogo from "@/assets/logos/clickhouse.svg";
import parallelLogo from "@/assets/logos/parallel.svg";
import replitLogo from "@/assets/logos/replit.svg";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "CinePilot AI — Autonomous Film Production Command Center" },
      {
        name: "description",
        content:
          "CinePilot AI runs specialist agents on Google Cloud Vertex AI that break down screenplays into scenes, schedules, budgets and risk reports.",
      },
      { property: "og:title", content: "CinePilot AI — Autonomous Film Production" },
      {
        property: "og:description",
        content:
          "Upload a screenplay and CinePilot's AI agents plan, schedule, budget and de-risk your production end-to-end.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Agents", href: "#agents" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Partner Technologies", href: "#partners" },
];

const features = [
  {
    icon: Bot,
    title: "Nine specialist agents",
    body: "Producer, Script, Schedule, Budget, Risk and more, orchestrated automatically per production.",
  },
  {
    icon: CalendarDays,
    title: "Smart scheduling",
    body: "Shoot days generated from your screenplay, with conflict, location and weather flags.",
  },
  {
    icon: Wallet,
    title: "Live budget control",
    body: "Editable line items with instant recalculation and cost-saving recommendations.",
  },
  {
    icon: FileText,
    title: "Automated reports",
    body: "Call sheets and daily production reports refresh whenever anything changes.",
  },
];

const agents = [
  { icon: Sparkles, name: "Producer Agent", body: "Routes every request to the right specialist and keeps context." },
  { icon: FileText, name: "Script Agent", body: "Scene breakdown, characters, dialogue and page counts." },
  { icon: CalendarDays, name: "Schedule Agent", body: "Builds and optimises the shooting calendar." },
  { icon: Wallet, name: "Budget Agent", body: "Forecasts line items and tracks variance in real time." },
  { icon: ShieldAlert, name: "Risk Agent", body: "Flags weather, permit, continuity and overtime exposure." },
  { icon: MapPin, name: "Location Agent", body: "Extracts and groups locations for company moves." },
  { icon: Boxes, name: "Props Agent", body: "Detects props, vehicles and set dressing per scene." },
  { icon: Shirt, name: "Costume Agent", body: "Builds wardrobe continuity across the shoot." },
  { icon: Film, name: "Reporting Agent", body: "Generates call sheets, DPRs and executive summaries." },
];

const solutions = [
  {
    title: "Independent producers",
    body: "Go from screenplay PDF to a costed, scheduled production plan in a single afternoon.",
  },
  {
    title: "Production companies",
    body: "Run unlimited productions side by side, each with its own isolated AI crew and workspace.",
  },
  {
    title: "Studios & executives",
    body: "Portfolio-level reporting, approvals and risk scoring across every active title.",
  },
];

const pricing = [
  {
    name: "Indie",
    price: "$0",
    note: "per month",
    perks: ["1 active production", "Screenplay breakdown", "Schedule & budget", "Email support"],
  },
  {
    name: "Studio",
    price: "$249",
    note: "per month",
    highlight: true,
    perks: [
      "Unlimited productions",
      "Full nine-agent crew",
      "Collaboration workspace",
      "Call sheets & DPRs",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "annual",
    perks: ["SSO & role controls", "Analytics warehouse", "Observability dashboards", "Dedicated success team"],
  },
];

const partners = [
  {
    name: "Google Cloud",
    logo: googleCloudLogo,
    badge: "Core AI Platform",
    products: ["Vertex AI Gemini", "Agent Builder", "Cloud Run", "Cloud Storage", "Firestore"],
    body: "Vertex AI Gemini powers screenplay reasoning and intelligent production planning. Agent Builder orchestrates autonomous production agents, Cloud Run hosts scalable backend services, Cloud Storage stores production assets and Firestore manages production data.",
  },
  {
    name: "IBM",
    logo: ibmLogo,
    badge: "Enterprise AI",
    products: ["IBM watsonx.ai", "IBM Granite", "Watson Discovery"],
    body: "watsonx.ai provides enterprise AI governance, document intelligence and trusted AI workflows for studio-scale productions.",
  },
  {
    name: "Grafana",
    logo: grafanaLogo,
    badge: "Observability",
    products: ["Grafana Cloud"],
    body: "Grafana dashboards visualise production health, crew activity, AI agent performance, schedules and budgets in real time.",
  },
  {
    name: "ClickHouse",
    logo: clickhouseLogo,
    badge: "Analytics Engine",
    products: ["ClickHouse Cloud"],
    body: "ClickHouse powers ultra-fast analytics across production timelines, budgets, agent events and screenplay insights.",
  },
  {
    name: "Parallel",
    logo: parallelLogo,
    badge: "High Performance AI",
    products: ["Parallel Runtime"],
    body: "Parallel accelerates multi-agent execution so screenplay analysis, scheduling and budgeting happen simultaneously.",
  },
  {
    name: "Replit",
    logo: replitLogo,
    badge: "AI Development & Production Tools",
    products: ["Replit Agent"],
    body: "Replit Agent helps CinePilot create lightweight production utilities for crews and departments, turning natural-language production requests into practical workflow tools.",
    details: {
      technology: "Replit Agent",
      role: "Production Utility Builder",
      usage:
        "CinePilot uses Replit Agent to create lightweight tools that solve specific operational problems during film production.",
      examples: [
        "Crew check-in",
        "Props tracking",
        "Equipment checkout",
        "Location scouting",
        "Crew availability",
        "Call-time confirmation",
      ],
    },
  },
];

/* Lightweight cinematic background: drifting agent nodes, workflow lines and floating cards. */
function HeroBackdrop() {
  const nodes = [
    { x: "12%", y: "22%", label: "Script" },
    { x: "34%", y: "62%", label: "Schedule" },
    { x: "62%", y: "18%", label: "Budget" },
    { x: "80%", y: "58%", label: "Risk" },
    { x: "50%", y: "38%", label: "Producer" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        {[
          "M 80 160 C 260 90, 380 260, 560 150",
          "M 200 420 C 380 340, 520 460, 760 330",
          "M 120 300 C 320 380, 600 200, 880 300",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/40"
            strokeDasharray="6 10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -80] }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.3 },
              opacity: { duration: 1 },
              strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" },
            }}
          />
        ))}
      </svg>

      {nodes.map((n, i) => (
        <motion.div
          key={n.label}
          className="absolute rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary backdrop-blur"
          style={{ left: n.x, top: n.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.35, 0.9, 0.35], y: [0, -14, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
        >
          {n.label}
        </motion.div>
      ))}

      {[
        { x: "6%", y: "70%", w: "w-28", rot: -6 },
        { x: "72%", y: "78%", w: "w-32", rot: 5 },
        { x: "88%", y: "26%", w: "w-24", rot: -3 },
      ].map((c, i) => (
        <motion.div
          key={c.x}
          className={`absolute ${c.w} rounded-xl border border-border/50 bg-white/5 p-2 backdrop-blur`}
          style={{ left: c.x, top: c.y, rotate: c.rot }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0.2, 0.55, 0.2], y: [0, -18, 0] }}
          transition={{ duration: 9 + i * 2, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}
        >
          <div className="h-1.5 w-2/3 rounded bg-primary/40" />
          <div className="mt-1.5 h-1 w-full rounded bg-foreground/15" />
          <div className="mt-1 h-1 w-4/5 rounded bg-foreground/10" />
        </motion.div>
      ))}
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />

      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Film className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-semibold">CinePilot</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <HeroBackdrop />
          <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-16 md:pt-24">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Autonomous multi-agent production assistant
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                Your entire production,
                <br />
                <span className="text-gradient">run by AI agents.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
                Upload a screenplay and CinePilot breaks it down into scenes, characters, shoot days,
                budget lines and risk reports — then keeps everything in sync as production evolves.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start your production
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-white/5 px-5 py-2.5 text-sm font-medium hover:bg-white/10"
                >
                  Sign in with Google
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Partner technologies */}
        <section id="partners" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Powered by Industry-Leading Technology
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            CinePilot AI is built on the platforms studios already trust for AI, observability and
            analytics at scale.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p, i) => (
              <motion.article
                key={p.name}
                onClick={() => "details" in p && setOpenPartner(openPartner === p.name ? null : p.name)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05 }}
                className="glass flex flex-col rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.logo}
                    alt={`${p.name} official logo`}
                    className="h-8 w-8 shrink-0 object-contain"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-primary">
                      {p.badge}
                    </span>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.products.map((prod) => (
                    <span
                      key={prod}
                      className="rounded-md border border-border/60 bg-white/5 px-2 py-0.5 text-[11px] text-foreground/80"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
                {"details" in p && p.details && (
                  <>
                    <button
                      type="button"
                      className="mt-3 self-start text-[11px] uppercase tracking-widest text-primary"
                    >
                      {openPartner === p.name ? "Hide details" : "View details"}
                    </button>
                    {openPartner === p.name && (
                      <div className="mt-3 rounded-xl border border-border/60 bg-white/5 p-3 text-sm">
                        <div className="font-display font-semibold">{p.name}</div>
                        <div className="text-xs text-primary">{p.details.technology}</div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="text-foreground/80">Role in CinePilot:</span>{" "}
                          {p.details.role}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{p.details.usage}</p>
                        <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                          {p.details.examples.map((e) => (
                            <li key={e}>• {e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </motion.article>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Everything a production office does, automated
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.05 * i }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* AI agents */}
        <section id="agents" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Meet the AI crew
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every production gets its own isolated agent team with private memory, reports and
            context — orchestrated by the Producer Agent.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border/50 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{a.name}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{a.body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Built for every size of production
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {solutions.map((s) => (
              <div key={s.title} className="glass rounded-2xl p-5">
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Pricing</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-5 ${
                  p.highlight ? "glass-strong border border-primary/40" : "glass"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  {p.highlight && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-3 font-display text-3xl font-semibold">{p.price}</div>
                <div className="text-xs text-muted-foreground">{p.note}</div>
                <ul className="mt-4 space-y-1.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <div className="glass rounded-2xl p-6 md:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              About CinePilot AI
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
              CinePilot AI is a SaaS production platform for filmmakers, production companies and
              studios. Each workspace owns its productions end to end: screenplays are the single
              source of truth, AI agents turn them into scene breakdowns, schedules, budgets, call
              sheets and risk reports, and the whole crew collaborates in one place as the shoot
              evolves.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Start your production
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} CinePilot AI</span>
          <span>
            Google Cloud Vertex AI · Google Agent Builder · IBM watsonx.ai · Grafana Cloud ·
            ClickHouse Cloud · Parallel Runtime
          </span>
        </div>
      </footer>
    </div>
  );
}
