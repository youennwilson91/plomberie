/**
 * Avis clients.
 *
 * ⚠️ MAQUETTE — les avis ci-dessous sont des EXEMPLES rédigés pour la
 * démonstration. Ce ne sont pas de vrais avis. Tant que `AVIS_EXEMPLE` vaut
 * `true`, la section affiche un bandeau qui le signale, pour qu'aucune
 * capture d'écran de la maquette ne puisse passer pour un avis authentique.
 *
 * Pour la mise en ligne :
 *   1. remplacer AVIS par les vrais avis de la fiche Google, VERBATIM (fautes
 *      et emoji compris — un avis retouché n'est plus un avis) ;
 *   2. renseigner LIEN_GOOGLE, NOTE_GLOBALE et NOMBRE_AVIS depuis la fiche ;
 *   3. passer AVIS_EXEMPLE à `false`.
 */

export type Avis = {
  auteur: string;
  /** Mois de publication (les dates relatives de Google vieillissent mal). */
  date: string;
  texte: string;
  /** Note de 1 à 5. */
  note?: number;
};

/** À passer à `false` une fois les vrais avis saisis. */
export const AVIS_EXEMPLE = true;

/**
 * Lien vers la fiche Google de l'établissement. [À COMPLÉTER] : coller l'URL
 * du panneau « Avis » de la fiche A.P.S.
 */
export const LIEN_GOOGLE =
  "https://www.google.com/search?q=A.P.S+plomberie+Sainte-Genevi%C3%A8ve-des-Bois";

/** Note moyenne de la fiche Google. `null` tant qu'elle n'est pas confirmée. */
export const NOTE_GLOBALE: number | null = 4.8;

/** Nombre total d'avis sur la fiche. `null` tant qu'il n'est pas renseigné. */
export const NOMBRE_AVIS: number | null = null;

export const AVIS: ReadonlyArray<Avis> = [
  {
    auteur: "Exemple — client",
    date: "à remplacer",
    note: 5,
    texte:
      "Chaudière tombée en panne un vendredi soir, intervention le lendemain matin. Diagnostic clair, pièce changée dans la foulée, tarif annoncé à l'avance et respecté.",
  },
  {
    auteur: "Exemple — cliente",
    date: "à remplacer",
    note: 5,
    texte:
      "Refonte complète de la salle de bain. Chantier propre, délais tenus, et l'équipe a pris le temps d'expliquer chaque choix technique. Résultat impeccable.",
  },
  {
    auteur: "Exemple — client",
    date: "à remplacer",
    note: 5,
    texte:
      "Installation d'une pompe à chaleur en remplacement d'une vieille chaudière. Bon accompagnement sur le dossier d'aides, et la facture de chauffage a nettement baissé.",
  },
  {
    auteur: "Exemple — cliente",
    date: "à remplacer",
    note: 4,
    texte:
      "Contrat d'entretien depuis deux ans. Rendez-vous pris sans difficulté, attestation envoyée le jour même. Je recommande.",
  },
  {
    auteur: "Exemple — client",
    date: "à remplacer",
    note: 5,
    texte:
      "Recherche de fuite dans un mur : trouvée en une heure, sans tout casser. Beaucoup de sérieux et de pédagogie.",
  },
];
