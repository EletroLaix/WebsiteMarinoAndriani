import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

export default defineConfig(({ command, mode }) => {
  const staticExport = mode === "pages" || process.env["STATIC_EXPORT"] === "1";

  return {
    resolve: {
      tsconfigPaths: true,
      dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
        ...(staticExport
          ? {
              prerender: {
                enabled: true,
                autoStaticPathsDiscovery: true,
                crawlLinks: true,
              },
            }
          : {}),
      }),
      ...(command === "build" && !staticExport ? [nitro({ preset: "node-server" })] : []),
      react(),
    ],
  };
});
