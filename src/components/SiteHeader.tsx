import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/Logo";
import { TEL_AFFICHE, TEL_LIEN } from "@/lib/entreprise";
import { SERVICES } from "@/lib/services";

const navLinkClass = "type-action text-sm transition-colors hover:text-accent-jaune";

/* Le site tient en une page : chaque intitulé pointe sur une ancre de
   l'accueil. « Nos services » n'a pas de page à lui — c'est uniquement le
   déclencheur du menu déroulant, qui renvoie sur les cartes de la section
   Services. */
const NAV = [
  { hash: undefined, label: "Accueil" },
  {
    label: "Nos services",
    children: SERVICES.map((service) => ({ hash: service.id, label: service.menu })),
  },
  { hash: "avis", label: "Avis" },
  { hash: "faq", label: "FAQ" },
  { hash: "contact", label: "Contact" },
] as const;

/* Distance depuis le haut du bandeau (h-28 = 7rem = 112px) : l'observateur
   considère le hero « passé » dès que son bord bas franchit cette ligne. */
const HEADER_HEIGHT_PX = 112;

type ServiceLink = { hash: string; label: string };

/**
 * Sous-menu « Nos services » du bandeau desktop. Ouvert au survol (avec un
 * court délai à la sortie pour traverser le vide entre le bouton et le
 * panneau), au focus clavier, et au clic pour le tactile. Échap referme.
 */
function NavServices({ tinted, items }: { tinted: boolean; items: ReadonlyArray<ServiceLink> }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={[
          navLinkClass,
          "inline-flex items-center gap-1",
          tinted ? "text-foreground" : "text-white",
        ].join(" ")}
      >
        Nos services
        <ChevronDown
          className={["size-4 transition-transform duration-200", open ? "rotate-180" : ""].join(
            " ",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Le pt-3 est une passerelle invisible : le curseur reste « dans » le
          groupe en descendant du bouton vers le panneau. */}
      <div
        className={[
          "absolute left-0 top-full pt-3 transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        ].join(" ")}
      >
        <div className="min-w-64 border border-foreground/10 bg-background py-2 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.label}
              to="/"
              hash={item.hash}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface hover:text-accent-jaune"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  /* Sans JS ou avant l'hydratation, on part teinté : jamais de texte sombre
     illisible sur l'image si l'observateur ne s'attache pas. */
  const [tinted, setTinted] = useState(!transparent);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparent) return;

    const heroEl = document.getElementById("hero");
    if (!heroEl) {
      setTinted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setTinted(!entry.isIntersecting);
      },
      { rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [transparent]);

  /* Le menu ne concerne que le mobile : au-delà de md, on repasse
     silencieusement en nav horizontale, pas la peine de garder le panneau
     ouvert. */
  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    const media = window.matchMedia("(min-width: 768px)");
    function handleMediaChange() {
      if (media.matches) setMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    media.addEventListener("change", handleMediaChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      media.removeEventListener("change", handleMediaChange);
    };
  }, [menuOpen]);

  return (
    <nav
      className={[
        transparent ? "fixed" : "sticky",
        "top-0 inset-x-0 z-50 border-b transition-colors duration-300",
        tinted
          ? "border-foreground/10 bg-background/90 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to="/" aria-label="A.P.S — accueil" className="flex items-center">
          <Logo variant={tinted ? "fonce" : "clair"} className="h-14 w-auto text-foreground" />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV.map((entry) =>
            "children" in entry ? (
              <NavServices key={entry.label} tinted={tinted} items={entry.children} />
            ) : (
              <Link
                key={entry.label}
                to="/"
                {...(entry.hash ? { hash: entry.hash } : {})}
                className={[navLinkClass, tinted ? "text-foreground" : "text-white"].join(" ")}
              >
                {entry.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            hash="contact"
            className={[
              "type-action hidden px-5 py-3 text-sm transition-colors duration-300 sm:block",
              tinted
                ? "bg-brand text-primary-foreground hover:bg-brand/90"
                : "bg-white text-foreground hover:bg-white/90",
            ].join(" ")}
          >
            Devis gratuit
          </Link>
          <a
            href={"tel:" + TEL_LIEN}
            className={[
              "type-action hidden items-center gap-2 border px-5 py-3 text-sm tabular-nums transition-colors duration-300 xl:flex",
              tinted
                ? "border-foreground/20 text-foreground hover:bg-foreground hover:text-primary-foreground"
                : "border-white/40 text-white hover:bg-white hover:text-foreground",
            ].join(" ")}
          >
            <Phone className="size-4" aria-hidden="true" />
            {TEL_AFFICHE}
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className={[
              "relative grid size-11 shrink-0 place-items-center border transition-colors duration-300 lg:hidden",
              tinted ? "border-foreground/15 text-foreground" : "border-white/40 text-white",
            ].join(" ")}
          >
            <Menu
              className={[
                "absolute size-5 transition-all duration-300",
                menuOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100",
              ].join(" ")}
              aria-hidden="true"
            />
            <X
              className={[
                "absolute size-5 transition-all duration-300",
                menuOpen ? "rotate-0 opacity-100" : "-rotate-45 opacity-0",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Grille dont la ligne passe de 0fr à 1fr : anime la hauteur du panneau
          sans connaître sa taille à l'avance, et sans garder de timer JS pour
          l'animation de sortie. */}
      <div
        id="menu-mobile"
        aria-hidden={!menuOpen}
        className={[
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0 border-t border-foreground/10 bg-background">
          <div className="flex max-h-[70vh] flex-col divide-y divide-foreground/10 overflow-y-auto px-6">
            {NAV.map((entry) =>
              "children" in entry ? (
                <div key={entry.label} className="py-3">
                  <span className="type-mark block py-2 text-muted-foreground">{entry.label}</span>
                  <div className="flex flex-col">
                    {entry.children.map((child) => (
                      <Link
                        key={child.label}
                        to="/"
                        hash={child.hash}
                        tabIndex={menuOpen ? undefined : -1}
                        onClick={() => setMenuOpen(false)}
                        className="type-action py-3 pl-4 text-sm text-foreground transition-colors hover:text-accent-jaune"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={entry.label}
                  to="/"
                  {...(entry.hash ? { hash: entry.hash } : {})}
                  tabIndex={menuOpen ? undefined : -1}
                  onClick={() => setMenuOpen(false)}
                  className="type-action py-5 text-sm text-foreground transition-colors hover:text-accent-jaune"
                >
                  {entry.label}
                </Link>
              ),
            )}
            <a
              href={"tel:" + TEL_LIEN}
              tabIndex={menuOpen ? undefined : -1}
              className="type-action flex items-center gap-2 py-5 text-sm tabular-nums text-foreground"
            >
              <Phone className="size-4" aria-hidden="true" />
              {TEL_AFFICHE}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
