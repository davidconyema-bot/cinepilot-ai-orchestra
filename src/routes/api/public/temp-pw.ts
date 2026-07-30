import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/temp-pw")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
          "d6517177-16c2-4ad2-98b0-568f4953f3ff",
          { password: "12345678qwerty" },
        );
        if (error) return new Response(error.message, { status: 500 });
        return new Response("ok");
      },
    },
  },
});
