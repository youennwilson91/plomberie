import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/Logo";
import { ADRESSE, EMAIL, HORAIRES, LIEN_ITINERAIRE, TEL_AFFICHE, TEL_LIEN } from "@/lib/entreprise";

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Logo variant="clair" className="h-16 w-auto" />
            <p className="mt-6 max-w-xs text-base leading-relaxed text-primary-foreground/70">
              Plomberie, chauffage et salle de bain à Sainte-Geneviève-des-Bois et dans tout
              l'Essonne. Installation, dépannage et entretien.
            </p>
          </div>

          <div className="space-y-4 text-base">
            <h2 className="type-mark text-primary-foreground/60">Nous joindre</h2>
            <a
              href={"tel:" + TEL_LIEN}
              className="flex items-center gap-3 tabular-nums transition-colors hover:text-accent-jaune"
            >
              <Phone className="size-4 shrink-0 text-accent-jaune" aria-hidden="true" />
              {TEL_AFFICHE}
            </a>
            <a
              href={"mailto:" + EMAIL}
              className="flex items-center gap-3 transition-colors hover:text-accent-jaune"
            >
              <Mail className="size-4 shrink-0 text-accent-jaune" aria-hidden="true" />
              {EMAIL}
            </a>
            <a
              href={LIEN_ITINERAIRE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 transition-colors hover:text-accent-jaune"
            >
              <MapPin className="mt-1 size-4 shrink-0 text-accent-jaune" aria-hidden="true" />
              <span>
                {ADRESSE.rue}
                <br />
                {ADRESSE.codePostal} {ADRESSE.ville}
              </span>
            </a>
          </div>

          <div className="space-y-4 text-base">
            <h2 className="type-mark text-primary-foreground/60">Horaires</h2>
            <ul className="space-y-2">
              {HORAIRES.map((creneau) => (
                <li key={creneau.jours} className="flex items-start gap-3">
                  <Clock className="mt-1 size-4 shrink-0 text-accent-jaune" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">{creneau.jours}</span>
                    <span className="text-primary-foreground/70">{creneau.heures}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-primary-foreground/15 pt-8 text-sm text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} A.P.S. Tous droits réservés.</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <Link to="/mentions-legales" className="transition-colors hover:text-accent-jaune">
              Mentions légales
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              to="/politique-de-confidentialite"
              className="transition-colors hover:text-accent-jaune"
            >
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
