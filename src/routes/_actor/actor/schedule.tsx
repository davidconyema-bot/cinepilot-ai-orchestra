import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Shirt, UserRound } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { actorSchedule } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/schedule")({
  component: ActorSchedule,
  head: () => ({
    meta: [
      { title: "Shooting Schedule — CinePilot Actor Studio" },
      { name: "description", content: "Your filming dates, call times, locations and wardrobe." },
      { property: "og:title", content: "Shooting Schedule — CinePilot Actor Studio" },
      { property: "og:description", content: "A professional production calendar built for actors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ActorSchedule() {
  return (
    <>
      <PageHeader title="Shooting Schedule" subtitle="Your upcoming filming days across all productions." />
      <div className="grid gap-4 md:grid-cols-2">
        {actorSchedule.map((d) => (
          <SectionCard key={d.id} title={d.scene} subtitle={d.date}>
            <div className="space-y-2 text-sm">
              <Line icon={Clock} label="Call time" value={d.callTime} />
              <Line icon={MapPin} label="Location" value={d.location} />
              <Line icon={UserRound} label="Director" value={d.director} />
              <Line icon={Shirt} label="Wardrobe" value={d.wardrobe} />
              <Line icon={CalendarDays} label="Notes" value={d.notes} />
            </div>
            <Badge variant="outline" className="mt-3">
              Confirmed
            </Badge>
          </SectionCard>
        ))}
      </div>
    </>
  );
}

function Line({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="flex-1 text-foreground/90">{value}</span>
    </div>
  );
}
