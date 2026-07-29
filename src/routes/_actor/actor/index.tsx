import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarDays, Clapperboard, ScrollText, Bell, Clock, Star } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import {
  actorProfile,
  actorMovies,
  actorSchedule,
  useActorStore,
} from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/")({
  component: ActorHome,
  head: () => ({
    meta: [
      { title: "Actor Dashboard — CinePilot AI" },
      {
        name: "description",
        content:
          "Your personal actor workspace: today's schedule, script progress, upcoming scenes and production updates.",
      },
      { property: "og:title", content: "Actor Dashboard — CinePilot AI" },
      {
        property: "og:description",
        content: "Every call time, script revision and director note in one cinematic workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ActorHome() {
  const { scripts, notices } = useActorStore();
  const readPct = Math.round((scripts.filter((s) => s.read).length / scripts.length) * 100);
  const current = actorMovies[0];
  const today = actorSchedule[0];

  const stats = [
    { label: "Active productions", value: actorMovies.length, icon: Clapperboard },
    { label: "Scripts to read", value: scripts.filter((s) => !s.read).length, icon: ScrollText },
    { label: "Upcoming scenes", value: actorSchedule.length, icon: CalendarDays },
    { label: "Unread alerts", value: notices.filter((n) => n.unread).length, icon: Bell },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${actorProfile.name.split(" ")[0]}`}
        subtitle="Here's your day on set, your scripts and everything the production needs from you."
      />

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard title="Your profile">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
              {actorProfile.name.charAt(0)}
            </div>
            <div>
              <div className="font-display text-lg font-semibold">{actorProfile.name}</div>
              <Badge variant="outline" className="mt-1">
                {actorProfile.role}
              </Badge>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{actorProfile.agency}</p>
          <div className="mt-4 rounded-xl border border-border/50 bg-white/5 p-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Current production
            </div>
            <div className="mt-1 font-display text-base font-semibold">{current.title}</div>
            <div className="text-xs text-muted-foreground">{current.character}</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${current.progress}%` }}
                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {current.progress}% shot · release {current.release}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-4"
              >
                <s.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 font-display text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <SectionCard title="Today's schedule" subtitle={today.date}>
              <div className="space-y-2 text-sm">
                <Row icon={Clock} label="Call time" value={today.callTime} />
                <Row icon={Clapperboard} label="Scene" value={today.scene} />
                <Row icon={CalendarDays} label="Location" value={today.location} />
                <Row icon={Star} label="Wardrobe" value={today.wardrobe} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{today.notes}</p>
            </SectionCard>

            <SectionCard title="Script progress" subtitle={`${readPct}% of your pages marked read`}>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${readPct}%` }}
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="mt-3 space-y-2">
                {scripts.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-white/5 px-3 py-2 text-xs"
                  >
                    <span>
                      {s.movie} · {s.scene}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {s.read ? "Read" : s.revision}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link
                to="/actor/scripts"
                className="mt-3 inline-block text-xs text-primary hover:underline"
              >
                Open script library →
              </Link>
            </SectionCard>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <SectionCard title="Upcoming scenes">
              <div className="space-y-2">
                {actorSchedule.slice(1).map((d) => (
                  <div key={d.id} className="rounded-xl border border-border/50 bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{d.scene}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {d.date}
                      </Badge>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Call {d.callTime} · {d.location}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Recent notifications">
              <div className="space-y-2">
                {notices.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl border p-3 ${
                      n.unread ? "border-primary/40 bg-primary/5" : "border-border/50 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{n.detail}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="flex-1 text-foreground/90">{value}</span>
    </div>
  );
}
