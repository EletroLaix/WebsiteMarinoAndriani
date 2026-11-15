import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// STATIC_EXPORT=1 -> build statico (prerender) per GitHub Pages.
// Default -> build server (nitro) usata dall'anteprima e dalla pubblicazione Lovable.
const staticExport = process.env["STATIC_EXPORT"] === "1";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    ...(staticExport
      ? {
          prerender: {
            enabled: true,
            autoStaticPathsDiscovery: true,
            crawlLinks: true,
          },
        }
      : {}),
  },
  ...(staticExport ? { nitro: false as const } : {}),
});
