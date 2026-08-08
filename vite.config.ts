import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    // Static prerender for GitHub Pages: generate HTML for every public route at build time.
    prerender: {
      enabled: true,
      autoStaticPathsDiscovery: true,
      crawlLinks: true,
    },
  },
  // GitHub Pages is a static host: we don't need the Nitro server bundle, only prerendered HTML.
  nitro: false,
});
