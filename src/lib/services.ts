import { Bath, Droplets, Flame, ShieldCheck, Thermometer, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Les six prestations affichées sur la devanture de l'agence. Chaque entrée a
 * un `id` : c'est l'ancre vers laquelle pointe le menu déroulant « Nos
 * services » du bandeau. Pas de page dédiée par service — la maquette tient
 * en une page.
 */
export type Service = {
  id: string;
  icon: LucideIcon;
  titre: string;
  /** Libellé court, tel qu'il apparaît dans le menu déroulant. */
  menu: string;
  accroche: string;
  points: ReadonlyArray<string>;
};

export const SERVICES: ReadonlyArray<Service> = [
  {
    id: "plomberie",
    icon: Droplets,
    titre: "Plomberie",
    menu: "Plomberie",
    accroche:
      "Tous travaux de plomberie, de la fuite qui goutte à la réfection complète du réseau.",
    points: [
      "Recherche et réparation de fuite",
      "Remplacement de canalisations",
      "Débouchage et évacuation",
      "Robinetterie et raccordements",
    ],
  },
  {
    id: "salle-de-bain",
    icon: Bath,
    titre: "Salle de bain & sanitaire",
    menu: "Salle de bain & sanitaire",
    accroche: "Création ou rénovation complète, de la dépose de l'ancien au dernier joint.",
    points: [
      "Douche à l'italienne, baignoire, WC",
      "Meubles, vasques et robinetterie",
      "Adaptation PMR",
      "Carrelage et finitions",
    ],
  },
  {
    id: "chauffage",
    icon: Flame,
    titre: "Chauffage & chaudière gaz",
    menu: "Chauffage & chaudière gaz",
    accroche:
      "Installation, remplacement et dépannage de chaudières gaz et de l'ensemble du réseau de chauffage.",
    points: [
      "Chaudière gaz à condensation",
      "Remplacement de radiateurs",
      "Plancher chauffant",
      "Mise en conformité gaz",
    ],
  },
  {
    id: "pompe-a-chaleur",
    icon: Wind,
    titre: "Pompe à chaleur",
    menu: "Pompe à chaleur",
    accroche:
      "Étude, pose et mise en service de PAC air/eau et air/air, avec accompagnement sur les aides.",
    points: [
      "Dimensionnement selon le logement",
      "PAC air/eau et air/air",
      "Remplacement d'une chaudière fioul",
      "Accompagnement MaPrimeRénov'",
    ],
  },
  {
    id: "ballon-thermodynamique",
    icon: Thermometer,
    titre: "Ballon thermodynamique",
    menu: "Ballon thermodynamique",
    accroche:
      "Eau chaude sanitaire à faible consommation : installation et remplacement de chauffe-eau.",
    points: [
      "Chauffe-eau thermodynamique",
      "Chauffe-eau électrique ou gaz",
      "Détartrage et entretien",
      "Groupe de sécurité et raccordement",
    ],
  },
  {
    id: "entretien",
    icon: ShieldCheck,
    titre: "Contrat d'entretien",
    menu: "Contrat d'entretien",
    accroche:
      "La visite annuelle obligatoire, l'attestation qui va avec, et un dépannage prioritaire.",
    points: [
      "Entretien annuel chaudière et PAC",
      "Attestation d'entretien fournie",
      "Réglage et contrôle de sécurité",
      "Dépannage prioritaire pour les abonnés",
    ],
  },
];

/** Marques installées et entretenues, relevées sur la devanture. */
export const MARQUES: ReadonlyArray<string> = [
  "Saunier Duval",
  "Frisquet",
  "Chaffoteaux",
  "Atlantic",
];

/**
 * Qualifications relevées sur les macarons collés en vitrine (Qualibat RGE,
 * RGE, PG, GRDF, Gaz Vert). [À CONFIRMER] : les libellés exacts et les numéros
 * de qualification doivent être repris des attestations du client avant mise
 * en ligne.
 */
export const QUALIFICATIONS: ReadonlyArray<{ sigle: string; libelle: string }> = [
  { sigle: "Qualibat RGE", libelle: "Qualification bâtiment" },
  { sigle: "RGE", libelle: "Reconnu Garant de l'Environnement" },
  { sigle: "PG", libelle: "Professionnel du Gaz" },
  { sigle: "GRDF", libelle: "Partenaire du réseau gaz" },
  { sigle: "Gaz Vert", libelle: "Installateur agréé" },
];
