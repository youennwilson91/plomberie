import ogImage from "@/assets/og.webp";
import { LIEN_GOOGLE } from "@/lib/avis";
import { ADRESSE, EMAIL, NOM_LONG, TEL_INTERNATIONAL, ZONES } from "@/lib/entreprise";

/** [À CONFIRMER] nom de domaine définitif du site. */
export const SITE_URL = "https://www.aps-plomberie.fr";

/** URL absolue de l'image Open Graph (les crawlers sociaux exigent une URL absolue). */
export const OG_IMAGE = SITE_URL + ogImage;

type PageHeadOptions = {
  title: string;
  description: string;
  /** Chemin absolu de la page, commençant par "/". */
  path: string;
};

/**
 * Métadonnées <head> communes à toutes les pages : titre, description, bloc
 * Open Graph / Twitter complet et lien canonique.
 */
export function pageHead({ title, description, path }: PageHeadOptions) {
  const url = SITE_URL + path;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/**
 * JSON-LD entreprise, injecté une fois dans le <head> global.
 *
 * `Plumber` est le type schema.org le plus proche du métier ; `HVACBusiness`
 * est ajouté en second type pour la partie chauffage.
 *
 * ⚠️ MAQUETTE : `geo` est un géocodage approximatif de la voie, pas du numéro,
 * et `openingHoursSpecification` reprend les horaires [À CONFIRMER] de
 * `entreprise.ts`. Ne pas publier sans les avoir validés avec le client.
 * Ne pas ajouter d'`aggregateRating` tant que les vrais avis ne sont pas
 * saisis — inventer une note est trompeur et sanctionné par Google.
 */
export const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Plumber", "HVACBusiness"],
  name: NOM_LONG,
  url: SITE_URL,
  image: OG_IMAGE,
  telephone: TEL_INTERNATIONAL,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADRESSE.rue,
    postalCode: ADRESSE.codePostal,
    addressLocality: ADRESSE.ville,
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.6389,
    longitude: 2.336,
  },
  areaServed: [...ZONES, "Essonne"],
  sameAs: [LIEN_GOOGLE],
};
