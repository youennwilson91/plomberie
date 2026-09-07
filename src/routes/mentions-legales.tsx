import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ADRESSE_COMPLETE, EMAIL, TEL_AFFICHE, TEL_LIEN } from "@/lib/entreprise";
import { pageHead } from "@/lib/seo";

const DESCRIPTION =
  "Mentions légales du site A.P.S : éditeur, directeur de la publication, contact, hébergeur et propriété intellectuelle.";

/* ⚠️ MAQUETTE : tout ce qui est marqué [À COMPLÉTER] doit être renseigné avec
   les documents de l'entreprise (extrait Kbis, statuts) avant mise en ligne.
   Publier des mentions légales incomplètes est une infraction (article 6 de la
   LCEN). */
export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    pageHead({
      title: "Mentions légales | A.P.S",
      description: DESCRIPTION,
      path: "/mentions-legales",
    }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
          <h1 className="type-display text-4xl lg:text-6xl">Mentions légales</h1>

          <p className="mt-8 border-l-4 border-accent-jaune bg-surface px-5 py-4 text-base leading-relaxed text-muted-foreground">
            Page de maquette : les éléments notés « [À COMPLÉTER] » attendent les informations
            légales de l'entreprise.
          </p>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Éditeur du site</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>A.P.S — [À COMPLÉTER : forme juridique et capital social].</p>
              <p>Siège social : {ADRESSE_COMPLETE}.</p>
              <p>SIREN [À COMPLÉTER].</p>
              <p>TVA intracommunautaire [À COMPLÉTER].</p>
              <p>RCS [À COMPLÉTER].</p>
              <p>Assurance responsabilité civile professionnelle : [À COMPLÉTER].</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Directeur de la publication</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>[À COMPLÉTER : nom du gérant].</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Contact</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                Téléphone :{" "}
                <a
                  href={"tel:" + TEL_LIEN}
                  className="text-brand underline underline-offset-2 transition-colors hover:text-accent-jaune"
                >
                  {TEL_AFFICHE}
                </a>
              </p>
              <p>
                E-mail :{" "}
                <a
                  href={"mailto:" + EMAIL}
                  className="underline underline-offset-2 transition-colors hover:text-accent-jaune"
                >
                  {EMAIL}
                </a>
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Hébergeur</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>[À COMPLÉTER : raison sociale et adresse de l'hébergeur retenu].</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Propriété intellectuelle</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                L'ensemble du site (textes, visuels, logo) est protégé par le droit de la propriété
                intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans
                autorisation préalable est interdite.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Données personnelles</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                Le traitement de vos données personnelles est détaillé dans notre{" "}
                <Link
                  to="/politique-de-confidentialite"
                  className="underline underline-offset-2 transition-colors hover:text-accent-jaune"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </section>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
