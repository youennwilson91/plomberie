import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AVIS, AVIS_EXEMPLE, LIEN_GOOGLE, NOMBRE_AVIS, NOTE_GLOBALE } from "@/lib/avis";

/** Cadence du défilement automatique. */
const DELAI_MS = 6000;

function Etoiles({ note }: { note: number }) {
  const pleines = Math.round(note);
  /* Virgule décimale : le libellé est lu à voix haute en français. */
  const lu = note.toLocaleString("fr-FR", { minimumFractionDigits: 1 });
  return (
    <span className="flex gap-0.5" role="img" aria-label={lu + " étoiles sur 5"}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={
            "size-4 " +
            (index < pleines ? "fill-accent-jaune text-accent-jaune" : "text-primary-foreground/20")
          }
        />
      ))}
    </span>
  );
}

/**
 * Défilement automatique, en pause dès que le lecteur s'en approche : survol,
 * focus clavier, ou préférence système « animations réduites ». Un carrousel
 * qui bouge pendant qu'on lit un avis est un carrousel qu'on ne lit pas.
 */
function useDefilement(api: CarouselApi | undefined, enPause: boolean) {
  useEffect(() => {
    if (!api || enPause) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, DELAI_MS);

    return () => window.clearInterval(timer);
  }, [api, enPause]);
}

export function AvisGoogle() {
  const [api, setApi] = useState<CarouselApi>();
  const [enPause, setEnPause] = useState(false);
  useDefilement(api, enPause);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="type-mark text-accent-jaune">Avis clients</p>
          <h2 className="type-display mt-6 max-w-xl text-3xl lg:text-5xl">
            Ce qu’en disent nos clients
          </h2>
          {/* Bandeau de maquette : disparaît dès que AVIS_EXEMPLE passe à false. */}
          {AVIS_EXEMPLE && (
            <p className="mt-6 max-w-md border border-accent-jaune/50 bg-accent-jaune/10 px-4 py-3 text-sm text-primary-foreground/80">
              Maquette : ces avis sont des exemples, à remplacer par les vrais avis Google de
              l’agence.
            </p>
          )}
        </div>

        {NOTE_GLOBALE !== null && (
          <div className="flex items-center gap-5 border-t-2 border-accent-jaune pt-5">
            <p className="flex items-baseline gap-1">
              <span className="type-display text-6xl tabular-nums lg:text-7xl">
                {NOTE_GLOBALE.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
              </span>
              <span className="type-data text-xl text-primary-foreground/75">/5</span>
            </p>
            <div>
              <Etoiles note={NOTE_GLOBALE} />
              <p className="type-mark mt-2 text-base text-primary-foreground/60">
                {/* Tant que les vrais avis ne sont pas saisis, la note est
                    signalée comme fictive : elle ne doit jamais pouvoir passer
                    pour une note Google réelle. */}
                {AVIS_EXEMPLE
                  ? "Note d'exemple"
                  : NOMBRE_AVIS !== null
                    ? NOMBRE_AVIS + " avis sur Google"
                    : "Note Google"}
              </p>
            </div>
          </div>
        )}
      </div>

      {AVIS.length > 0 && (
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="mt-16"
          onMouseEnter={() => setEnPause(true)}
          onMouseLeave={() => setEnPause(false)}
          onFocusCapture={() => setEnPause(true)}
          onBlurCapture={() => setEnPause(false)}
        >
          <CarouselContent>
            {AVIS.map((avis) => (
              <CarouselItem
                key={avis.auteur}
                className="md:basis-1/2 lg:basis-1/3"
                aria-roledescription="avis"
              >
                <figure className="flex h-full flex-col border-t-2 border-accent-jaune pt-6">
                  {avis.note !== undefined && <Etoiles note={avis.note} />}
                  <blockquote
                    className={
                      "flex-1 text-base leading-relaxed" + (avis.note !== undefined ? " mt-4" : "")
                    }
                  >
                    « {avis.texte} »
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="block text-base font-semibold">{avis.auteur}</span>
                    <span className="mt-1 block text-sm text-primary-foreground/60">
                      {avis.date}
                    </span>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-10 flex items-center gap-3">
            <CarouselPrevious className="static translate-y-0 rounded-none border-primary-foreground/25 bg-transparent hover:bg-primary-foreground hover:text-foreground" />
            <CarouselNext className="static translate-y-0 rounded-none border-primary-foreground/25 bg-transparent hover:bg-primary-foreground hover:text-foreground" />
            <a
              href={LIEN_GOOGLE}
              target="_blank"
              rel="noopener noreferrer"
              className="type-action ml-auto border border-primary-foreground/25 px-8 py-4 text-sm transition-colors hover:bg-primary-foreground hover:text-foreground"
            >
              Lire tous les avis sur Google
            </a>
          </div>
        </Carousel>
      )}
    </div>
  );
}
