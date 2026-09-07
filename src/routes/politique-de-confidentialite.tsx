import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EMAIL } from "@/lib/entreprise";
import { pageHead } from "@/lib/seo";

const DESCRIPTION =
  "Politique de confidentialité d'A.P.S : données collectées via le formulaire de contact, finalité, base légale, destinataires, durée de conservation et vos droits.";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () =>
    pageHead({
      title: "Politique de confidentialité | A.P.S",
      description: DESCRIPTION,
      path: "/politique-de-confidentialite",
    }),
  component: PolitiqueDeConfidentialitePage,
});

function PolitiqueDeConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
          <h1 className="type-display text-4xl lg:text-6xl">Politique de confidentialité</h1>

          <p className="mt-8 border-l-4 border-accent-jaune bg-surface px-5 py-4 text-base leading-relaxed text-muted-foreground">
            Page de maquette : à relire avec l'entreprise avant mise en ligne (identité du
            responsable de traitement, durées de conservation réelles).
          </p>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Responsable du traitement</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                A.P.S —{" "}
                <a
                  href={"mailto:" + EMAIL}
                  className="underline underline-offset-2 transition-colors hover:text-accent-jaune"
                >
                  {EMAIL}
                </a>
                .
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Données que nous collectons</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                Via le formulaire de contact : nom, téléphone, e-mail (facultatif), code postal,
                nature de la demande, prestation concernée, et les précisions que vous saisissez
                librement dans le message.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Pourquoi</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>Traiter votre demande, établir le devis et vous recontacter.</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Base légale</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                L'exécution de mesures précontractuelles prises à votre demande (article 6.1.b du
                RGPD).
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Qui reçoit ces données</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                L'équipe d'A.P.S ; notre prestataire d'envoi d'e-mails Resend (Resend, Inc.,
                États-Unis), qui achemine techniquement le message. Aucune donnée n'est vendue ni
                utilisée à des fins publicitaires.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Durée de conservation</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                Vos données sont conservées 3 ans à compter de notre dernier contact si votre
                demande n’aboutit pas, puis supprimées. Si le devis se concrétise, elles sont
                conservées le temps de la relation contractuelle et les durées légales applicables.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Vos droits</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                Accès, rectification, effacement, opposition, limitation et portabilité — en
                écrivant à{" "}
                <a
                  href={"mailto:" + EMAIL}
                  className="underline underline-offset-2 transition-colors hover:text-accent-jaune"
                >
                  {EMAIL}
                </a>
                . Vous pouvez aussi introduire une réclamation auprès de la CNIL (www.cnil.fr).
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="type-mark text-muted-foreground">Cookies</h2>
            <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                Ce site ne dépose aucun cookie de mesure d'audience ni de traçage publicitaire.
                Seuls des éléments techniques strictement nécessaires à l'affichage des pages sont
                utilisés.
              </p>
            </div>
          </section>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
