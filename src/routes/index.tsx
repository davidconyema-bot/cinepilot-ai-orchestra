import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Film, Bot, CalendarDays, Wallet, FileText, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "CinePilot AI — Autonomous Film Production Command Center" },
      {
        name: "description",
        content:
          "CinePilot AI runs nine specialist agents that break down scripts, build schedules, forecast budgets and flag risks for your production.",
      },
      { property: "og:title", content: "CinePilot AI — Autonomous Film Production" },
      {
        property: "og:description",
        content:
          "Nine specialist AI agents plan, schedule, budget and de-risk your film production end-to-end.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const features = [
  { icon: Bot, title: "Nine specialist agents", body: "Producer, Script, Schedule, Budget, Risk and more, orchestrated automatically." },
  { icon: CalendarDays, title: "Smart scheduling", body: "Shoot days generated from your screenplay, with conflict and weather flags." },
  { icon: Wallet, title: "Live budget control", body: "Editable line items with instant recalculation and cost-saving suggestions." },
  { icon: FileText, title: "Automated reports", body: "Call sheets and production reports refresh whenever anything changes." },
];

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

      <header className="relative flex h-16 items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Film className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-base font-semibold">CinePilot</span>
        </div>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign in
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 pb-24 pt-14 md:pt-24">
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
            budget lines and risk reports — then keeps everything in sync as the production moves.
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

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold">{f.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
