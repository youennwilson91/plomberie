/**
 * Envoi des e-mails de formulaire via l'API HTTP de Resend (https://resend.com).
 * Centralisé ici pour que les formulaires du site ne dupliquent pas la config.
 *
 * Pourquoi Resend en HTTP et pas du SMTP : Railway bloque les ports SMTP
 * sortants.
 *
 * Mode « sans domaine » (actuel) : tant qu'aucun domaine n'est vérifié chez
 * Resend, l'envoi part de `onboarding@resend.dev` et ne peut aller que vers
 * l'adresse du compte Resend. L'e-mail du visiteur est en Reply-To : on répond
 * directement au client.
 *
 * Variables d'environnement (voir .env.example) — à définir sur l'hébergeur :
 *   RESEND_API_KEY     — obligatoire
 *   CONTACT_EMAIL      — destinataire ; DOIT être l'adresse du compte Resend
 *                        tant qu'aucun domaine n'est vérifié
 *   RESEND_FROM_EMAIL  — expéditeur (défaut onboarding@resend.dev ; à passer sur
 *                        une adresse du domaine une fois celui-ci vérifié)
 *
 * Débogage : les envois réussis sont tracés « [email] » (résultat seul, aucune
 * donnée client ni clé API). En cas d'échec, la demande complète est en
 * revanche journalisée sous « [form][ÉCHEC] » : c'est le filet de sécurité —
 * l'e-mail est perdu mais la demande reste récupérable dans les logs Railway
 * (onglet Logs, filtrer sur "[form][ÉCHEC]").
 */

const FROM_FALLBACK = "onboarding@resend.dev";
/* ⚠️ MAQUETTE : adresse de repli à remplacer par celle du compte Resend d'A.P.S. */
const TO_FALLBACK = "contact@aps-plomberie.fr";

type FormEmail = {
  subject: string;
  text: string;
  /**
   * Adresse du visiteur, mise en Reply-To pour répondre directement. Chaîne
   * vide acceptée : l'e-mail est facultatif dans le formulaire de contact, on
   * omet alors l'en-tête plutôt que d'envoyer un Reply-To vide (que Resend
   * refuse).
   */
  replyTo: string;
};

/**
 * Filet de sécurité : quand l'e-mail ne part pas, on écrit la demande entière
 * dans les logs pour qu'elle ne soit jamais perdue. On accepte ici les données
 * personnelles dans les logs — c'est un cas rare et le lead prime.
 */
function journaliserEchec(params: FormEmail, raison: string): void {
  console.error(
    `[form][ÉCHEC] e-mail non envoyé (${raison}) — demande à traiter à la main :\n` +
      `Répondre à : ${params.replyTo}\n` +
      `Objet : ${params.subject}\n` +
      params.text,
  );
}

export async function sendFormEmail(params: FormEmail): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error(
      "[email] RESEND_API_KEY absente des variables d'environnement — envoi impossible",
    );
    journaliserEchec(params, "RESEND_API_KEY non configurée");
    throw new Error("RESEND_API_KEY n’est pas configurée.");
  }

  const from = process.env["RESEND_FROM_EMAIL"] || FROM_FALLBACK;
  const to = process.env["CONTACT_EMAIL"] || TO_FALLBACK;

  let response: Response;
  const startedAt = Date.now();
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        ...(params.replyTo.trim() === "" ? {} : { reply_to: params.replyTo }),
        subject: params.subject,
        text: params.text,
      }),
      // Sans borne, une API injoignable ferait tourner le formulaire à l'infini.
      signal: AbortSignal.timeout(15000),
    });
  } catch (cause) {
    console.error(
      `[email] appel Resend échoué après ${Date.now() - startedAt} ms (réseau ou timeout) :`,
      cause,
    );
    journaliserEchec(params, "API Resend injoignable");
    throw new Error("L’e-mail n’a pas pu être envoyé (API injoignable).", { cause });
  }

  const body = await response.text();
  if (!response.ok) {
    console.error(`[email] Resend a répondu ${response.status} ${response.statusText} : ${body}`);
    journaliserEchec(params, `Resend ${response.status}`);
    throw new Error("Échec de l’envoi de l’e-mail : " + body);
  }

  let id: string | undefined;
  try {
    id = (JSON.parse(body) as { id?: string }).id;
  } catch {
    /* corps non-JSON : on garde id indéfini */
  }
  console.info(`[email] envoyé (id=${id ?? "?"}, ${Date.now() - startedAt} ms)`);
}
