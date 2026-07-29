import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { actorProfile, actorMovies } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/profile")({
  component: ActorProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — CinePilot Actor Studio" },
      { name: "description", content: "Your actor profile, agency, contact details and biography." },
      { property: "og:title", content: "Profile — CinePilot Actor Studio" },
      { property: "og:description", content: "Your professional card inside CinePilot." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ActorProfilePage() {
  return (
    <>
      <PageHeader title="Profile" subtitle="How the production sees you." />
      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-3xl font-semibold text-primary-foreground">
              {actorProfile.name.charAt(0)}
            </div>
            <div className="mt-3 font-display text-xl font-semibold">{actorProfile.name}</div>
            <Badge variant="outline" className="mt-1">{actorProfile.role}</Badge>
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <Row icon={Building2} value={actorProfile.agency} />
            <Row icon={Mail} value={actorProfile.email} />
            <Row icon={Phone} value={actorProfile.phone} />
            <Row icon={MapPin} value={actorProfile.location} />
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Biography">
            <p className="text-sm leading-relaxed text-foreground/85">{actorProfile.bio}</p>
          </SectionCard>
          <SectionCard title="Current productions">
            <div className="grid gap-2 sm:grid-cols-2">
              {actorMovies.map((m) => (
                <div key={m.id} className="rounded-xl border border-border/50 bg-white/5 p-3">
                  <div className="font-display text-sm font-semibold">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground">{m.character} · {m.status}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

function Row({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="text-foreground/85">{value}</span>
    </div>
  );
}
