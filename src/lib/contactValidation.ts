/**
 * Validation du formulaire de contact, partagée entre le navigateur et le
 * serveur : le même `validate` tourne des deux côtés, pour que rien ne dépende
 * du JavaScript client.
 */

export type Field = "nom" | "telephone" | "email" | "codePostal" | "prestation" | "message";

export type Values = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

/** Nature de la demande. La première valeur est celle cochée par défaut. */
export const NATURES = [
  "Devis / installation",
  "Dépannage",
  "Entretien / contrat",
  "Autre demande",
] as const;

export type Nature = (typeof NATURES)[number];

export const PRESTATIONS: ReadonlyArray<string> = [
  "Plomberie",
  "Salle de bain & sanitaire",
  "Chauffage & chaudière gaz",
  "Pompe à chaleur",
  "Ballon thermodynamique",
  "Contrat d'entretien",
  "Je ne sais pas encore",
];

export const EMPTY_VALUES: Values = {
  nom: "",
  telephone: "",
  email: "",
  codePostal: "",
  prestation: "",
  message: "",
};

export function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.nom.trim().length < 2) {
    errors.nom = "Indiquez votre nom.";
  }
  if (!/^[+0-9 .()-]{9,}$/.test(values.telephone.trim())) {
    errors.telephone = "Indiquez un numéro où vous joindre.";
  }
  /* L'e-mail est facultatif : beaucoup d'appels de dépannage se règlent au
     téléphone. Mais s'il est renseigné, il doit être exploitable — c'est lui
     qui sert de Reply-To. */
  if (values.email.trim() !== "" && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(values.email.trim())) {
    errors.email = "Cette adresse e-mail semble incorrecte.";
  }
  if (!/^\d{5}$/.test(values.codePostal.trim())) {
    errors.codePostal = "Code postal à 5 chiffres.";
  }
  if (!PRESTATIONS.includes(values.prestation)) {
    errors.prestation = "Choisissez la prestation concernée.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Décrivez brièvement votre besoin (10 caractères minimum).";
  }

  return errors;
}
