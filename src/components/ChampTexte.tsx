/**
 * Champ texte simple, au même gabarit que les autres champs des formulaires
 * (libellé + input souligné + message d'erreur). Sert notamment aux paires
 * « code postal » / « ville » saisies à la main.
 */

const fieldClass =
  "w-full min-w-0 border-b-2 border-foreground/15 bg-transparent py-3 text-base transition-colors focus:border-accent-jaune focus:outline-none";
const labelClass = "type-mark block text-muted-foreground";
const errorClass = "text-sm font-medium text-destructive";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  autoComplete?: string;
  maxLength?: number;
};

export function ChampTexte({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  autoComplete,
  maxLength,
}: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass}
      />
      {error && (
        <p id={`${id}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}
