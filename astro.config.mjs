// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    css: {
      // Assurer que les styles sont traités correctement
      devSourcemap: true,
    },
    server: {
      hmr: {
        // Configuration pour assurer que HMR fonctionne sur toutes les routes
        protocol: "ws",
        host: "localhost",
        path: "/__hmr",
      },
      // Empêcher les erreurs 404 lors de la navigation
      fs: {
        strict: false,
      },
    },
    // S'assurer que tous les assets ont un chemin de base absolu
    base: "/",
  },
});
