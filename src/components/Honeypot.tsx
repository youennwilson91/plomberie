/**
 * Champ leurre anti-bot : invisible et hors du flux de tabulation pour un
 * humain, mais les robots qui remplissent tous les champs le remplissent. Si
 * la valeur n'est pas vide à l'envoi, la demande est ignorée côté serveur.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="societe">Ne remplissez pas ce champ</label>
      <input
        id="societe"
        name="societe"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
