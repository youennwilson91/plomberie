import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

// `?inline` : on récupère le CSS compilé comme chaîne pour l'injecter dans un
// <style> du <head> plutôt qu'en <link> bloquant le rendu. Le HTML étant
// compressé en brotli par nitro/compression.ts, le surcoût de transfert est nul
// (~13 Kio, comme le fichier), mais on économise une requête bloquante.
import appCss from "../styles.css?inline";
import { orgJsonLd } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="type-display text-7xl text-foreground">404</h1>
        <h2 className="type-display mt-4 text-xl text-foreground">Page introuvable</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="type-display text-xl text-foreground">Cette page ne s’est pas chargée</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Un problème est survenu de notre côté. Réessayez ou revenez à l’accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l’accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "A.P.S | Plombier chauffagiste à Sainte-Geneviève-des-Bois" },
      {
        name: "description",
        content:
          "Plomberie, chauffage et salle de bain à Sainte-Geneviève-des-Bois (91). Devis gratuit.",
      },
      { property: "og:title", content: "A.P.S — Plomberie & Chauffage" },
      {
        property: "og:description",
        content:
          "Plomberie, chauffage et salle de bain à Sainte-Geneviève-des-Bois (91). Devis gratuit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    styles: [{ children: appCss }],
    // JSON-LD entreprise, une seule fois pour tout le site. La clé `scripts` du
    // retour de head() est mappée sur `match.headScripts` par TanStack Router
    // (load-server.ts / load-client.ts) puis rendue dans le <head> par
    // <HeadContent /> — le <script type="application/ld+json"> sort donc bien
    // côté SSR, lisible par les crawlers. Pas besoin de l'injecter à la main.
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgJsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
