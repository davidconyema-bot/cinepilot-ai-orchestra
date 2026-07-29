import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { PageHeader } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { actorMovies } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/movies")({
  component: MyMovies,
  head: () => ({
    meta: [
      { title: "My Movies — CinePilot Actor Studio" },
      {
        name: "description",
        content: "Every production you're cast in, with role, status, director, producer and progress.",
      },
      { property: "og:title", content: "My Movies — CinePilot Actor Studio" },
      { property: "og:description", content: "Your filmography in production, live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function MyMovies() {
  return (
    <>
      <PageHeader
        title="My Movies"
        subtitle="Productions you're currently cast in, with live shooting progress."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actorMovies.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass overflow-hidden rounded-2xl"
          >
            <div
              className={`relative flex h-40 items-end bg-gradient-to-br ${m.accent} p-4`}
            >
              <Film className="absolute right-4 top-4 h-6 w-6 text-foreground/40" />
              <div>
                <div className="font-display text-xl font-semibold tracking-tight">
                  {m.title}
                </div>
                <div className="text-xs text-foreground/80">{m.character}</div>
              </div>
            </div>
            <div className="space-y-2 p-4 text-sm">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{m.status}</Badge>
                <span className="text-xs text-muted-foreground">Release {m.release}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Director: <span className="text-foreground/90">{m.director}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Producer: <span className="text-foreground/90">{m.producer}</span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>Shooting progress</span>
                  <span>{m.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.progress}%` }}
                    className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
