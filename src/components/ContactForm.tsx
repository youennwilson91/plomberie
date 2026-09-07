import { useState } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";

import { ChampTexte } from "@/components/ChampTexte";
import { Honeypot } from "@/components/Honeypot";
import { TEL_AFFICHE, TEL_LIEN } from "@/lib/entreprise";
import {
  EMPTY_VALUES,
  NATURES,
  PRESTATIONS,
  validate,
  type Errors,
  type Field,
  type Nature,
  type Values,
} from "@/lib/contactValidation";
import { sendContactRequest } from "@/lib/contactRequest";

const labelClass = "type-mark block text-muted-foreground";
const selectClass =
  "w-full min-w-0 border-b-2 border-foreground/15 bg-transparent py-3 text-base transition-colors focus:border-accent-jaune focus:outline-none";

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [nature, setNature] = useState<Nature>(NATURES[0]);
  const [urgent, setUrgent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye">("saisie");
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);

  function set(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    /* On efface l'erreur du champ dès la première frappe : la corriger ne doit
       pas demander de renvoyer le formulaire pour le constater. */
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById("contact-formulaire")?.scrollIntoView({ block: "start" });
      return;
    }

    setEtat("envoi");
    setErreurEnvoi(null);
    try {
      await sendContactRequest({ data: { values, nature, urgent, honeypot } });
      setEtat("envoye");
    } catch (error) {
      console.error(error);
      setEtat("saisie");
      setErreurEnvoi(
        "L'envoi a échoué. Réessayez dans un instant, ou appelez-nous au " + TEL_AFFICHE + ".",
      );
    }
  }

  if (etat === "envoye") {
    return (
      <div className="border-t-2 border-accent-jaune bg-background p-8">
        <CheckCircle2 className="size-10 text-accent-jaune" aria-hidden="true" />
        <h3 className="type-display mt-6 text-2xl">Demande envoyée</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Nous vous rappelons sous 24 h ouvrées. Pour une urgence (fuite, panne de chauffage),
          appelez-nous directement.
        </p>
        <a
          href={"tel:" + TEL_LIEN}
          className="type-action mt-8 inline-flex items-center gap-2 bg-brand px-5 py-3 text-sm tabular-nums text-primary-foreground transition-colors hover:bg-brand/90"
        >
          <Phone className="size-4" aria-hidden="true" />
          {TEL_AFFICHE}
        </a>
      </div>
    );
  }

  return (
    <form
      id="contact-formulaire"
      onSubmit={handleSubmit}
      noValidate
      className="border-t-2 border-accent-jaune bg-background p-6 sm:p-8"
    >
      <fieldset className="space-y-3">
        <legend className={labelClass}>Votre demande</legend>
        <div className="flex flex-wrap gap-2 pt-1">
          {NATURES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={nature === option}
              onClick={() => setNature(option)}
              className={[
                "type-action border px-4 py-2.5 text-xs transition-colors",
                nature === option
                  ? "border-brand bg-brand text-primary-foreground"
                  : "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              ].join(" ")}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <ChampTexte
          id="nom"
          label="Nom et prénom"
          value={values.nom}
          onChange={(value) => set("nom", value)}
          error={errors.nom}
          autoComplete="name"
          maxLength={80}
        />
        <ChampTexte
          id="telephone"
          label="Téléphone"
          value={values.telephone}
          onChange={(value) => set("telephone", value)}
          error={errors.telephone}
          autoComplete="tel"
          inputMode="numeric"
          maxLength={20}
          placeholder="06 12 34 56 78"
        />
        <ChampTexte
          id="email"
          label="E-mail (facultatif)"
          value={values.email}
          onChange={(value) => set("email", value)}
          error={errors.email}
          autoComplete="email"
          maxLength={120}
        />
        <ChampTexte
          id="codePostal"
          label="Code postal"
          value={values.codePostal}
          onChange={(value) => set("codePostal", value)}
          error={errors.codePostal}
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={5}
          placeholder="91700"
        />
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="prestation" className={labelClass}>
          Prestation concernée
        </label>
        <select
          id="prestation"
          name="prestation"
          value={values.prestation}
          onChange={(event) => set("prestation", event.target.value)}
          aria-invalid={errors.prestation ? true : undefined}
          aria-describedby={errors.prestation ? "prestation-error" : undefined}
          className={selectClass}
        >
          <option value="">Choisissez…</option>
          {PRESTATIONS.map((prestation) => (
            <option key={prestation} value={prestation}>
              {prestation}
            </option>
          ))}
        </select>
        {errors.prestation && (
          <p id="prestation-error" className="text-sm font-medium text-destructive">
            {errors.prestation}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="message" className={labelClass}>
          Votre besoin
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1500}
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Type de logement, âge de l'installation, ce qui ne va pas…"
          className="w-full min-w-0 resize-y border-b-2 border-foreground/15 bg-transparent py-3 text-base transition-colors focus:border-accent-jaune focus:outline-none"
        />
        {errors.message && (
          <p id="message-error" className="text-sm font-medium text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      <label className="mt-6 flex items-start gap-3 text-base">
        <input
          type="checkbox"
          checked={urgent}
          onChange={(event) => setUrgent(event.target.checked)}
          className="mt-1 size-4 accent-[var(--color-brand)]"
        />
        <span className="text-muted-foreground">
          C'est une urgence (fuite, panne de chauffage, plus d'eau chaude).
        </span>
      </label>

      <Honeypot value={honeypot} onChange={setHoneypot} />

      {erreurEnvoi && (
        <p role="alert" className="mt-6 text-sm font-medium text-destructive">
          {erreurEnvoi}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="type-action inline-flex items-center gap-2 bg-brand px-6 py-4 text-sm text-primary-foreground transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          {etat === "envoi" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {etat === "envoi" ? "Envoi…" : "Envoyer ma demande"}
        </button>
        <p className="text-sm text-muted-foreground">Réponse sous 24 h ouvrées.</p>
      </div>
    </form>
  );
}
