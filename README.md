# A.P.S — Plomberie & Chauffage

Site vitrine de l'agence **A.P.S**, 222 Rte de Corbeil, 91700
Sainte-Geneviève-des-Bois — 01 60 16 89 80.

**État : maquette.** Le site est fonctionnel de bout en bout (SSR, formulaire,
SEO), mais une partie du contenu est à valider avec le client. Voir
« À compléter avant mise en ligne » plus bas.

Base technique reprise du projet `ddsud` : TanStack Start (React 19) + Vite,
Tailwind v4, shadcn/ui, Nitro en preset `node_server`.

## Développement

Node.js 22 et npm — [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
npm i
npm run dev
```

## Assets

- `src/assets/devanture.jpg` / `.webp` — photo de la devanture, fond du hero.
  `devanture-760w.webp` est la variante mobile du `srcSet`.
- `src/assets/logo.jpg` / `.webp` — logo de l'enseigne. Le `.webp` est le JPG
  détouré (fond blanc rendu transparent) : c'est lui qu'affiche
  `src/components/Logo.tsx`, sur fond clair comme sur fond bleu.
- `src/assets/og.webp` — image de partage (Open Graph), recadrée depuis la
  devanture. Les favicons de `public/` sont le logo sur fond bleu.

Les `.webp` sont régénérés depuis les `.jpg` avec ImageMagick ; si le client
fournit une photo ou un logo de meilleure qualité, remplacer le `.jpg` puis
reconvertir.

## Structure

Le site tient en **une page**. Les six prestations sont des ancres de
l'accueil (`#plomberie`, `#salle-de-bain`, `#chauffage`, `#pompe-a-chaleur`,
`#ballon-thermodynamique`, `#entretien`) — le menu déroulant « Nos services »
du bandeau y renvoie, il n'y a pas de page par service. Seules trois URL
existent : `/`, `/mentions-legales`, `/politique-de-confidentialite`.

Le contenu éditable est centralisé, pas dispersé dans le JSX :

| Fichier                 | Contenu                                                   |
| ----------------------- | --------------------------------------------------------- |
| `src/lib/entreprise.ts` | Adresse, téléphone, e-mail, horaires, communes desservies |
| `src/lib/services.ts`   | Les six prestations, les marques, les qualifications      |
| `src/lib/avis.ts`       | Avis clients et note Google                               |
| `src/routes/index.tsx`  | Hero, réassurance, étapes, FAQ                            |
| `src/lib/seo.ts`        | Nom de domaine, JSON-LD entreprise                        |

## À compléter avant mise en ligne

Chercher les marqueurs `[À COMPLÉTER]` et `[À CONFIRMER]` dans le code. Les
points bloquants :

1. **Avis clients** — `src/lib/avis.ts` contient des avis d'EXEMPLE. Tant que
   `AVIS_EXEMPLE` vaut `true`, la page l'indique explicitement (bandeau + note
   marquée « note d'exemple »). Saisir les vrais avis Google verbatim, coller
   le lien de la fiche, puis passer `AVIS_EXEMPLE` à `false`.
2. **Mentions légales** — forme juridique, SIREN, TVA, RCS, assurance RC pro,
   directeur de publication, hébergeur. Obligatoire (article 6 de la LCEN).
3. **Coordonnées** — l'adresse e-mail (`contact@aps-plomberie.fr`) et le nom de
   domaine (`SITE_URL` dans `src/lib/seo.ts`) sont des hypothèses.
   `public/robots.txt` et `public/sitemap.xml` portent le même domaine, à
   corriger en même temps.
4. **Horaires** — lus sur le panneau de la vitrine (lun–jeu 8h–12h / 14h–17h,
   vendredi jusqu'à 16h) puis corrigés par le client : fermé le week-end, le
   samedi matin sur RDV du panneau n'a plus cours.
5. **Qualifications** — les macarons de la vitrine (Qualibat RGE, RGE, PG,
   GRDF, Gaz Vert) sont repris tels quels ; libellés et numéros exacts à
   reprendre des attestations.
6. **FAQ** — les réponses sont plausibles pour le métier mais n'engagent que la
   maquette : délais, garanties et périmètre à relire avec le client.

## Mise en production

Build serveur : `npm run build` puis `npm run start`
(`node .output/server/index.mjs`). Pas d'export statique — le formulaire passe
par une server function qui a besoin d'un runtime Node. Railway doit builder
avec le preset Nitro `node_server` (déjà configuré dans `vite.config.ts`).

Version de Node épinglée à 22 via `.nvmrc` et le champ `engines` de
`package.json`.

Variables d'environnement à définir sur l'hébergeur : voir `.env.example`
(`RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL`).

## Formulaire de contact

Le formulaire de l'accueil envoie un e-mail via l'API HTTP de
[Resend](https://resend.com) depuis une server function
(`src/lib/sendEmail.ts`). Pas de SMTP : Railway bloque les ports SMTP sortants.

Mise en place prévue **sans domaine vérifié** chez Resend :

1. Créer le compte Resend avec l'adresse e-mail de l'agence.
2. Créer une clé API (Sending access) → `RESEND_API_KEY`.
3. `CONTACT_EMAIL` = l'adresse du compte Resend (tant qu'aucun domaine n'est
   vérifié, Resend n'autorise l'envoi qu'à cette adresse).
4. `RESEND_FROM_EMAIL` : laisser vide (défaut `onboarding@resend.dev`).

Limites du mode sans domaine : 100 e-mails/jour, destinataire figé au compte
Resend, expéditeur `onboarding@resend.dev` (risque de spam). Pour lever ça :
vérifier le domaine chez Resend (enregistrements DKIM/SPF), puis passer
`RESEND_FROM_EMAIL` sur une adresse du domaine.

**Filet de sécurité** : si l'appel à Resend échoue, la demande complète est
écrite dans les logs sous `[form][ÉCHEC]` (voir `sendEmail.ts`) — aucun lead
n'est perdu silencieusement. À surveiller les premiers jours.

L'e-mail du visiteur est facultatif (beaucoup d'appels se règlent au
téléphone) ; quand il est renseigné, il sert de `Reply-To`.

Anti-spam : un champ leurre (honeypot) plus un rate-limit en mémoire de
5 envois / 10 min par IP (`src/lib/rateLimit.ts`).
