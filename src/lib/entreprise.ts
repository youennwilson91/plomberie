/**
 * Coordonnées et informations de l'agence, centralisées ici : elles servent au
 * bandeau, au pied de page, au JSON-LD et aux formulaires. Un seul endroit à
 * corriger quand le client valide la maquette.
 *
 * ⚠️ MAQUETTE — les valeurs marquées [À CONFIRMER] sont des hypothèses
 * plausibles, pas des données transmises par le client. À valider avant mise
 * en ligne.
 */

export const NOM = "A.P.S";
export const NOM_LONG = "A.P.S — Plomberie & Chauffage";

/** Numéro affiché (avec espaces) et sa forme composable pour `tel:`. */
export const TEL_AFFICHE = "01 60 16 89 80";
export const TEL_LIEN = "0160168980";
export const TEL_INTERNATIONAL = "+33160168980";

/** [À CONFIRMER] adresse e-mail de contact. */
export const EMAIL = "contact@aps-plomberie.fr";

export const ADRESSE = {
  rue: "222 Rte de Corbeil",
  codePostal: "91700",
  ville: "Sainte-Geneviève-des-Bois",
  pays: "France",
} as const;

export const ADRESSE_COMPLETE = `${ADRESSE.rue}, ${ADRESSE.codePostal} ${ADRESSE.ville}`;

/** Lien d'itinéraire Google Maps, construit depuis l'adresse. */
export const LIEN_ITINERAIRE =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ADRESSE_COMPLETE);

/**
 * Horaires relevés sur le panneau « HORAIRES D'OUVERTURE » de la vitrine, puis
 * corrigés par le client : l'agence est fermée le week-end (le panneau
 * mentionne un samedi matin sur RDV, ce n'est plus le cas).
 */
export const HORAIRES: ReadonlyArray<{ jours: string; heures: string }> = [
  { jours: "Lundi – Jeudi", heures: "8h00 – 12h00 · 14h00 – 17h00" },
  { jours: "Vendredi", heures: "8h00 – 12h00 · 14h00 – 16h00" },
  { jours: "Samedi – Dimanche", heures: "Fermé" },
];

/** Communes citées dans la zone d'intervention. [À CONFIRMER] avec le client. */
export const ZONES: ReadonlyArray<string> = [
  "Sainte-Geneviève-des-Bois",
  "Brétigny-sur-Orge",
  "Saint-Michel-sur-Orge",
  "Fleury-Mérogis",
  "Morsang-sur-Orge",
  "Villemoisson-sur-Orge",
  "Longpont-sur-Orge",
  "Épinay-sur-Orge",
  "Ris-Orangis",
  "Grigny",
  "Viry-Châtillon",
  "Arpajon",
  "Montlhéry",
  "Évry-Courcouronnes",
  "Corbeil-Essonnes",
  "Athis-Mons",
];
