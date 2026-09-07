/**
 * Limiteur de débit en mémoire, par adresse IP, à fenêtre glissante.
 *
 * Rôle : filet léger contre le remplissage automatique des formulaires, en
 * complément du champ honeypot. L'état vit uniquement dans la mémoire du
 * process et repart de zéro à chaque redéploiement Railway — c'est acceptable
 * pour ce volume de trafic. La ressource qu'on protège est le quota Resend
 * (100 e-mails / jour) : au-delà, les demandes légitimes ne partiraient plus.
 */

const MAX_ENVOIS = 5;
const FENETRE_MS = 10 * 60 * 1000;

/** IP → horodatages (ms) des envois récents. */
const envois = new Map<string, number[]>();

export function verifierDebit(ip: string): void {
  const maintenant = Date.now();
  const limite = maintenant - FENETRE_MS;

  // Purge des entrées expirées de toute la Map (pas de timer : on nettoie à
  // chaque appel pour éviter la croissance mémoire).
  for (const [cle, horodatages] of envois) {
    const encoreValides = horodatages.filter((t) => t > limite);
    if (encoreValides.length === 0) {
      envois.delete(cle);
    } else if (encoreValides.length !== horodatages.length) {
      envois.set(cle, encoreValides);
    }
  }

  const recents = (envois.get(ip) ?? []).filter((t) => t > limite);

  if (recents.length >= MAX_ENVOIS) {
    throw new Error(
      "Trop de demandes envoyées. Patientez quelques minutes ou appelez-nous directement.",
    );
  }

  recents.push(maintenant);
  envois.set(ip, recents);
}
