import logo from "@/assets/logo.webp";

/**
 * Logo A.P.S : le fichier de l'enseigne, détouré sur fond transparent — il se
 * pose donc aussi bien sur le bandeau clair que sur le bleu du hero et du pied
 * de page.
 *
 * `variant` ne colore que la ligne de texte à côté du logo :
 *   "clair" sur fond sombre, "fonce" sur fond clair.
 */
export function Logo({
  variant = "fonce",
  className = "h-14 w-auto",
}: {
  variant?: "clair" | "fonce";
  className?: string;
}) {
  return (
    <span className={"flex items-center gap-3 " + className}>
      <img
        src={logo}
        alt="Logo A.P.S"
        width={205}
        height={191}
        className="h-full w-auto shrink-0"
      />
      {/* L'acronyme est déjà dans le logo : le texte à côté ne répète pas
          « A.P.S », il dit le métier. Masqué sur les très petits écrans, où le
          logo seul suffit. */}
      <span
        className={[
          "type-mark hidden text-[0.6875rem] leading-tight sm:block",
          variant === "clair" ? "text-white/75" : "text-muted-foreground",
        ].join(" ")}
      >
        Plomberie
        <br />
        Chauffage
      </span>
    </span>
  );
}
