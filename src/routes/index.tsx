import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, ShieldCheck, Star, Wrench } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AvisGoogle } from "@/components/AvisGoogle";
import { ContactForm } from "@/components/ContactForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AVIS_EXEMPLE, LIEN_GOOGLE, NOTE_GLOBALE } from "@/lib/avis";
import {
  ADRESSE,
  ADRESSE_COMPLETE,
  EMAIL,
  HORAIRES,
  LIEN_ITINERAIRE,
  TEL_AFFICHE,
  TEL_LIEN,
  ZONES,
} from "@/lib/entreprise";
import { MARQUES, QUALIFICATIONS, SERVICES } from "@/lib/services";
import { pageHead } from "@/lib/seo";
import devanture from "@/assets/devanture.webp";
import devanture760 from "@/assets/devanture-760w.webp";

const DESCRIPTION =
  "Plombier chauffagiste à Sainte-Geneviève-des-Bois (91) : installation, dépannage et entretien de chaudière gaz, pompe à chaleur, ballon thermodynamique et salle de bain. Devis gratuit.";

/** Les trois promesses tenues sous le hero, avant tout argumentaire. */
const REASSURANCE = [
  {
    icon: Wrench,
    titre: "Dépannage rapide",
    texte: "Fuite, panne de chaudière, plus d'eau chaude : on passe vite, et on répare.",
  },
  {
    icon: ShieldCheck,
    titre: "Artisan qualifié",
    texte: "RGE et Professionnel Gaz : vos travaux ouvrent droit aux aides à la rénovation.",
  },
  {
    icon: MapPin,
    titre: "Agence de proximité",
    texte: "Un local à Sainte-Geneviève-des-Bois, où l'on vous reçoit sans rendez-vous.",
  },
];

/** Le déroulé d'une intervention, du premier appel à la facture. */
const ETAPES = [
  {
    titre: "Vous appelez",
    texte:
      "Un artisan vous répond, pas un standard. On cerne le besoin au téléphone et on fixe un créneau.",
  },
  {
    titre: "Visite et devis",
    texte:
      "On vient voir l'installation sur place. Le devis est gratuit, détaillé, et sans engagement.",
  },
  {
    titre: "Intervention",
    texte:
      "Travaux réalisés à la date convenue, chantier laissé propre, et le prix du devis est le prix payé.",
  },
];

/** JSON-LD FAQPage : mêmes questions/réponses que l'accordéon, pour le rich
 *  result Google. Les réponses en étapes sont aplaties en une seule phrase
 *  (une liste n'est pas un format reconnu par la propriété `text`). */
function faqJsonLd(items: ReadonlyArray<{ q: string; a: string | string[] }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(item.a) ? item.a.join(" ") : item.a,
      },
    })),
  };
}

/* ⚠️ MAQUETTE : réponses plausibles pour le métier, à relire et corriger avec
   le client (délais, tarifs, garanties) avant mise en ligne. */
const FAQ: ReadonlyArray<{ q: string; a: string | string[] }> = [
  {
    q: "Intervenez-vous en urgence ?",
    a:
      "Oui, pour tout ce qui ne peut pas attendre : fuite d'eau, panne de chaudière en hiver, absence d'eau chaude. Appelez-nous au " +
      TEL_AFFICHE +
      " — le téléphone reste le moyen le plus rapide, le formulaire est fait pour les demandes de devis.",
  },
  {
    q: "Le devis est-il payant ?",
    a: "Non. La visite et le devis sont gratuits et sans engagement. Le montant annoncé est celui que vous payez : pas de supplément découvert en cours de chantier sans votre accord écrit.",
  },
  {
    q: "L'entretien annuel de la chaudière est-il obligatoire ?",
    a: "Oui, pour toute chaudière de 4 à 400 kW, l'entretien est annuel et obligatoire. Nous délivrons l'attestation d'entretien à remettre à votre assurance dans les 15 jours suivant la visite.",
  },
  {
    q: "Quelles marques installez-vous et entretenez-vous ?",
    a:
      "Nous travaillons principalement avec " +
      MARQUES.join(", ") +
      ". Nous intervenons aussi sur les autres marques du marché pour l'entretien et le dépannage.",
  },
  {
    q: "Puis-je bénéficier d'aides pour une pompe à chaleur ?",
    a: "Notre qualification RGE ouvre droit aux principaux dispositifs (MaPrimeRénov', CEE, TVA réduite selon les travaux). Nous vous indiquons ce à quoi vous pouvez prétendre et nous fournissons les pièces nécessaires au dossier.",
  },
  {
    q: "Combien de temps dure la rénovation d'une salle de bain ?",
    a: "Comptez une à deux semaines pour une salle de bain complète, selon la dépose à réaliser et le carrelage. Le planning est fixé au devis, et nous n'ouvrons pas deux chantiers à la fois.",
  },
  {
    q: "Dans quelles communes intervenez-vous ?",
    a: "Sainte-Geneviève-des-Bois et l'ensemble du secteur nord de l'Essonne — Brétigny, Saint-Michel-sur-Orge, Morsang, Épinay-sur-Orge, Viry-Châtillon, Évry-Courcouronnes… Au-delà, appelez-nous : selon le chantier, on se déplace.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "A.P.S | Plombier chauffagiste à Sainte-Geneviève-des-Bois (91)",
      description: DESCRIPTION,
      path: "/",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd(FAQ)),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader transparent />

      <main>
        {/* Hero — la photo de la devanture occupe toute la largeur. Le voile
            est un dégradé latéral : opaque à gauche pour porter le titre en
            blanc, transparent à droite pour laisser voir l'enseigne.
            id="hero" : le bandeau l'observe pour savoir quand se teinter. */}
        <section id="hero" className="relative overflow-hidden bg-brand">
          <img
            src={devanture}
            srcSet={`${devanture760} 760w, ${devanture} 1360w`}
            sizes="100vw"
            alt="La devanture de l'agence A.P.S, enseigne « Chauffage » et « Plomberie », 222 route de Corbeil à Sainte-Geneviève-des-Bois"
            width={1360}
            height={494}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[65%_center] lg:object-center"
          />
          {/* Deux voiles superposés : le dégradé latéral tient le texte sur
              grand écran, l'aplat sombre prend le relais en dessous de lg, où
              la colonne de texte couvre toute la largeur. */}
          <div
            className="absolute inset-0 bg-[linear-gradient(100deg,oklch(0.24_0.06_258/0.97)_0%,oklch(0.24_0.06_258/0.94)_42%,oklch(0.24_0.06_258/0.6)_64%,oklch(0.24_0.06_258/0.35)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-foreground/35 lg:hidden" aria-hidden="true" />

          <div className="relative mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-center px-6 pt-36 pb-16 lg:min-h-[44rem] lg:px-12 lg:pt-44 lg:pb-24">
            {/* max-w-3xl : le titre tient en trois lignes voulues jusqu'en
                text-6xl, sans repli parasite au milieu d'une ligne. */}
            <div className="max-w-3xl">
              <p className="type-mark text-accent-jaune">
                Plomberie · Chauffage · Sainte-Geneviève-des-Bois
              </p>
              <h1 className="type-display mt-6 text-4xl text-white sm:text-5xl lg:text-6xl">
                <span className="block">Votre eau, votre</span>
                <span className="block">chauffage, entre de</span>
                <span className="block">
                  <span className="underline decoration-accent-jaune decoration-4 underline-offset-8">
                    bonnes
                  </span>{" "}
                  mains.
                </span>
              </h1>
              <p className="type-subtitle mt-8 max-w-xl text-lg leading-relaxed text-white/85">
                Installation, dépannage et entretien en plomberie et chauffage dans tout le nord de
                l'Essonne. Une agence, des artisans qualifiés, et un devis gratuit sous 48 h.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={"tel:" + TEL_LIEN}
                  className="type-action flex items-center justify-center gap-2 bg-accent-jaune px-6 py-4 text-sm tabular-nums text-accent-foreground transition-colors hover:bg-accent-jaune/90"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {TEL_AFFICHE}
                </a>
                <Link
                  to="/"
                  hash="contact"
                  className="type-action flex items-center justify-center border border-white/40 px-6 py-4 text-sm text-white transition-colors hover:bg-white hover:text-foreground"
                >
                  Demander un devis
                </Link>
              </div>

              <p className="type-mark mt-12 flex max-w-xl flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/25 pt-6 text-base text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-accent-jaune" aria-hidden="true" />
                  {ADRESSE.rue}
                </span>
                {NOTE_GLOBALE !== null && !AVIS_EXEMPLE && (
                  <a
                    href={LIEN_GOOGLE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-jaune"
                  >
                    Noté{" "}
                    <span className="font-semibold text-accent-jaune tabular-nums">
                      {NOTE_GLOBALE.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
                    </span>
                    <Star
                      className="size-4 fill-accent-jaune text-accent-jaune"
                      aria-hidden="true"
                    />
                    sur Google
                  </a>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-accent-jaune" aria-hidden="true" />
                  RGE · Professionnel Gaz
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Réassurance */}
        <section className="border-b border-foreground/10 bg-surface">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 lg:px-12">
            {REASSURANCE.map((item) => (
              <div key={item.titre} className="flex gap-4">
                <item.icon className="mt-1 size-6 shrink-0 text-accent-jaune" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-semibold">{item.titre}</h2>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {item.texte}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services — chaque carte porte l'ancre visée par le menu déroulant. */}
        <section id="services" className="scroll-mt-28 bg-background">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
            <p className="type-mark text-accent-jaune">Nos services</p>
            <h2 className="type-display mt-6 max-w-2xl text-3xl lg:text-5xl">
              Ce qu'on prend en charge
            </h2>
            <p className="type-subtitle mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Du robinet qui goutte au remplacement complet du système de chauffage, chez les
              particuliers comme dans les copropriétés.
            </p>

            <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <article
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-32 border-t border-foreground/15 pt-6"
                >
                  <service.icon className="size-6 text-accent-jaune" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold">{service.titre}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {service.accroche}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-base leading-relaxed text-muted-foreground"
                      >
                        <span
                          className="mt-2.5 size-1.5 shrink-0 bg-accent-jaune"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Marques & qualifications */}
        <section className="bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-12">
            <div>
              <h2 className="type-display text-2xl lg:text-3xl">Les marques que l'on installe</h2>
              <ul className="mt-8 flex flex-wrap gap-3">
                {MARQUES.map((marque) => (
                  <li
                    key={marque}
                    className="border border-foreground/15 bg-background px-5 py-3 text-base font-semibold"
                  >
                    {marque}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Nous entretenons et dépannons également les autres marques du marché.
              </p>
            </div>
            <div>
              <h2 className="type-display text-2xl lg:text-3xl">Nos qualifications</h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {QUALIFICATIONS.map((qualification) => (
                  <li
                    key={qualification.sigle}
                    className="border-t-2 border-accent-jaune bg-background px-5 py-4"
                  >
                    <span className="type-display block text-lg">{qualification.sigle}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {qualification.libelle}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Ces qualifications conditionnent l'accès aux aides à la rénovation énergétique.
              </p>
            </div>
          </div>
        </section>

        {/* Déroulé d'une intervention */}
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
            <h2 className="type-display max-w-2xl text-3xl lg:text-4xl">Comment ça se passe</h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {ETAPES.map((etape, index) => (
                <li key={etape.titre} className="border-t border-foreground/15 pt-6">
                  <span className="type-data text-4xl text-accent-jaune">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{etape.titre}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {etape.texte}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Zone d'intervention */}
        <section id="zone" className="scroll-mt-28 bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.3fr] lg:px-12">
            <div>
              <p className="type-mark text-accent-jaune">Zone d'intervention</p>
              <h2 className="type-display mt-6 text-3xl lg:text-4xl">Le nord de l'Essonne</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Nous intervenons depuis notre agence de Sainte-Geneviève-des-Bois, dans un rayon
                d'une vingtaine de kilomètres. Votre commune n'est pas listée ? Appelez-nous, on
                regarde.
              </p>
              <a
                href={LIEN_ITINERAIRE}
                target="_blank"
                rel="noopener noreferrer"
                className="type-action mt-8 inline-flex items-center gap-2 border border-foreground/20 px-5 py-3 text-sm transition-colors hover:bg-foreground hover:text-primary-foreground"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Voir l'itinéraire
              </a>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-center sm:grid-cols-3">
              {ZONES.map((commune) => (
                <li
                  key={commune}
                  className="flex gap-2.5 text-base leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 bg-accent-jaune" aria-hidden="true" />
                  {commune}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Avis — preuve sociale juste avant les objections */}
        <section id="avis" className="scroll-mt-28 bg-foreground text-primary-foreground">
          <AvisGoogle />
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-28 bg-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-12 lg:py-28">
            <div>
              <p className="type-mark text-accent-jaune">FAQ</p>
              <h2 className="type-display mt-6 text-3xl lg:text-5xl">Questions fréquentes</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Une question qui n'est pas là ? Appelez-nous au{" "}
                <a
                  href={"tel:" + TEL_LIEN}
                  className="text-brand underline underline-offset-2 hover:text-accent-jaune"
                >
                  {TEL_AFFICHE}
                </a>
                .
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, index) => (
                <AccordionItem key={item.q} value={"faq-" + index} className="border-foreground/15">
                  <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-xl pb-6 text-base leading-relaxed text-muted-foreground">
                    {Array.isArray(item.a) ? (
                      <ol className="list-decimal space-y-2 pl-5">
                        {item.a.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ol>
                    ) : (
                      item.a
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-28 bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-12 lg:py-28">
            <div>
              <p className="type-mark text-accent-jaune">Contact</p>
              <h2 className="type-display mt-6 text-3xl lg:text-5xl">Parlons de votre projet</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Décrivez votre besoin, nous vous rappelons sous 24 h ouvrées. Pour une urgence, le
                téléphone reste le plus rapide.
              </p>

              <dl className="mt-10 space-y-6 text-base">
                <div className="flex gap-4">
                  <Phone className="mt-1 size-5 shrink-0 text-accent-jaune" aria-hidden="true" />
                  <div>
                    <dt className="type-mark text-muted-foreground">Téléphone</dt>
                    <dd className="mt-1">
                      <a
                        href={"tel:" + TEL_LIEN}
                        className="tabular-nums transition-colors hover:text-accent-jaune"
                      >
                        {TEL_AFFICHE}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="mt-1 size-5 shrink-0 text-accent-jaune" aria-hidden="true" />
                  <div>
                    <dt className="type-mark text-muted-foreground">Agence</dt>
                    <dd className="mt-1">
                      <a
                        href={LIEN_ITINERAIRE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent-jaune"
                      >
                        {ADRESSE_COMPLETE}
                      </a>
                    </dd>
                    <dd className="mt-1 text-muted-foreground">
                      <a
                        href={"mailto:" + EMAIL}
                        className="transition-colors hover:text-accent-jaune"
                      >
                        {EMAIL}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-1 size-5 shrink-0 text-accent-jaune" aria-hidden="true" />
                  <div>
                    <dt className="type-mark text-muted-foreground">Horaires</dt>
                    {HORAIRES.map((creneau) => (
                      <dd key={creneau.jours} className="mt-1">
                        <span className="font-semibold">{creneau.jours}</span>{" "}
                        <span className="text-muted-foreground">{creneau.heures}</span>
                      </dd>
                    ))}
                  </div>
                </div>
              </dl>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
