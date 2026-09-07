import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { NATURES, validate, type Nature, type Values } from "@/lib/contactValidation";
import { verifierDebit } from "@/lib/rateLimit";
import { sendFormEmail } from "@/lib/sendEmail";

type ContactPayload = {
  values: Values;
  nature: Nature;
  /** Le client se dit dans une situation urgente (fuite, panne de chauffage). */
  urgent: boolean;
  /** Champ leurre anti-bot : doit rester vide. */
  honeypot: string;
};

function buildEmail(payload: ContactPayload): { subject: string; text: string } {
  const { values, nature, urgent } = payload;

  const lines = [
    "Nature : " + nature + (urgent ? " — SIGNALÉ URGENT" : ""),
    "Prestation : " + values.prestation,
    "",
    "Nom : " + values.nom,
    "Téléphone : " + values.telephone,
    "E-mail : " + (values.email.trim() === "" ? "non renseigné" : values.email),
    "Code postal : " + values.codePostal,
    "",
    "Message :",
    values.message,
  ];

  const subject =
    (urgent ? "[URGENT] " : "") +
    nature +
    " — " +
    values.prestation +
    " (" +
    values.codePostal +
    ")";

  return { subject, text: lines.join("\n") };
}

export const sendContactRequest = createServerFn({ method: "POST" })
  .validator((input: ContactPayload) => input)
  .handler(async ({ data }) => {
    if (data.honeypot.trim() !== "") {
      console.info("[form] contact ignoré (honeypot rempli)");
      return { success: true as const };
    }

    const ip = getRequestIP({ xForwardedFor: true }) ?? "inconnu";
    verifierDebit(ip);

    const errors = validate(data.values);
    if (Object.keys(errors).length > 0) {
      console.warn("[form] contact rejeté — validation serveur :", errors);
      throw new Error("Données du formulaire invalides.");
    }
    if (!NATURES.includes(data.nature)) {
      throw new Error("Nature de demande invalide.");
    }

    const { subject, text } = buildEmail(data);
    /* Sans e-mail saisi, on ne peut pas répondre par mail : le Reply-To
       retombe sur la boîte de l'agence, et le numéro est dans le corps. */
    const replyTo =
      data.values.email.trim() === ""
        ? (process.env["CONTACT_EMAIL"] ?? "")
        : data.values.email.trim();

    await sendFormEmail({ subject, text, replyTo });

    return { success: true as const };
  });
