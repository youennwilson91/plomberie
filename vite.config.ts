// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Self-hosted platforms (Railway, etc.) need a standalone Node server, not the
  // Cloudflare Worker bundle Lovable's sandbox builds by default.
  //
  // Le wrapper Lovable transmet tel quel l'objet `nitro` à Nitro (`{ ...userNitroOpts }`)
  // mais son type public ne liste que `preset` : d'où le cast.
  nitro: {
    preset: "node_server",
    // Génère les variantes .gz et .br des assets publics (CSS, JS, polices) au
    // build : le serveur les sert quand le navigateur les accepte, sans surcoût
    // CPU ni CDN. Corrige « requêtes de blocage du rendu » (feuille de styles
    // 92 Kio → ~13 Kio en brotli).
    compressPublicAssets: { gzip: true, brotli: true },
    // Compresse aussi la réponse HTML (rendue à la volée, donc non couverte
    // ci-dessus). Corrige « latence de la demande de document ».
    plugins: ["./nitro/compression.ts"],
  } as { preset: string },
});
