import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Cloud, Clock, MapPin, Users, Wrench } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { shootDays } from "@/lib/mock-data";

export const Route = createFileRoute("/schedule")({
  component: Schedule,
  head: () => ({
    meta: [
      { title: "Schedule — CinePilot AI" },
      { name: "description", content: "Interactive shoot day calendar with conflicts and weather." },
    ],
  }),
});

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthDays = Array.from({ length: 35 }, (_, i) => i - 2);

function Schedule() {
  return (
    <>
      <PageHeader
        title="Production Schedule"
        subtitle="Drag-and-drop shoot days. Conflicts, weather, and cast availability flagged automatically."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard
          className="xl:col-span-2"
          title="July 2026"
          subtitle="Neon Skyline — Week 3 of 6"
        >
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {weekDays.map((d) => (
              <div key={d} className="text-xs text-center text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {monthDays.map((d, i) => {
              const isValid = d > 0 && d <= 31;
              const isShoot = [22, 23, 24, 25, 26, 29, 30].includes(d);
              const conflict = [23, 24].includes(d);
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`relative h-20 rounded-lg border p-1.5 text-xs cursor-grab ${
                    !isValid
                      ? "border-transparent bg-transparent text-muted-foreground/30"
                      : conflict
                      ? "border-destructive/40 bg-destructive/10"
                      : isShoot
                      ? "border-primary/40 bg-primary/10"
                      : "border-border/40 bg-white/5"
                  }`}
                >
                  {isValid && (
                    <>
                      <div className="font-mono font-medium">{d}</div>
                      {isShoot && (
                        <div className="mt-1 space-y-0.5">
                          <div className="truncate text-[10px] text-foreground">
                            Sc. {12 + i - 22 * (d > 21 ? 1 : 0)}
                          </div>
                          {conflict && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Conflicts" subtitle="Detected by Risk Agent">
          <div className="space-y-2">
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Actor double-booking
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Marcus V. scheduled for Sc. 15 (Jul 23) and voice-over recording.
              </div>
            </div>
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-warning">
                <Cloud className="h-4 w-4" />
                Weather risk
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                60% rain forecast for Griffith Observatory (Jul 24).
              </div>
            </div>
            <div className="rounded-lg border border-info/40 bg-info/10 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-info">
                <Wrench className="h-4 w-4" />
                Equipment overlap
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Alexa Mini LF needed on both Jul 22 and Jul 23.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="mt-6" title="Upcoming Shoot Days" subtitle="Next 5 days">
        <div className="space-y-3">
          {shootDays.map((d, i) => (
            <motion.div
              key={d.date}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-xl border p-4 ${
                d.conflict
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border/40 bg-white/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase">
                      {new Date(d.date).toLocaleDateString("en", { weekday: "short" })}
                    </div>
                    <div className="font-display text-2xl font-semibold">
                      {new Date(d.date).getDate()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {d.scenes.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="border-primary/40 text-primary"
                        >
                          {s}
                        </Badge>
                      ))}
                      {d.conflict && (
                        <Badge className="bg-destructive/20 text-destructive border-0 gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Conflict
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {d.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" /> {d.crew} crew
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> {d.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Cloud className="h-3 w-3" /> {d.weather}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {d.actors.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      Equipment: {d.equipment}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
