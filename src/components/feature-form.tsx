"use client";

import { useId, useState } from "react";
import {
  CONFIDENCE_OPTIONS,
  Feature,
  IMPACT_OPTIONS,
  formatScore,
  riceScore,
} from "@/lib/rice";

interface FeatureFormProps {
  onAdd: (feature: Feature) => void;
}

interface FormValues {
  title: string;
  description: string;
  category: string;
  reach: string;
  impact: string;
  confidence: string;
  effort: string;
}

const EMPTY_VALUES: FormValues = {
  title: "",
  description: "",
  category: "",
  reach: "",
  impact: "",
  confidence: "",
  effort: "",
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const inputClass =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:ring-teal-400/50";

function borderClass(hasError: boolean) {
  return hasError
    ? "border-red-500 dark:border-red-500"
    : "border-zinc-300 dark:border-zinc-700";
}

function parseReach(raw: string): number | null {
  if (raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function parseEffort(raw: string): number | null {
  if (raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.title.trim() === "") {
    errors.title = "Ingresa un título.";
  }
  if (values.category.trim() === "") {
    errors.category = "Ingresa una categoría.";
  }
  if (values.reach.trim() === "") {
    errors.reach = "Ingresa cuántas personas alcanza por trimestre.";
  } else if (parseReach(values.reach) === null) {
    errors.reach = "Debe ser un número entero mayor o igual a 0.";
  }
  if (values.impact === "") {
    errors.impact = "Selecciona el impacto.";
  }
  if (values.confidence === "") {
    errors.confidence = "Selecciona la confianza.";
  }
  if (values.effort.trim() === "") {
    errors.effort = "Ingresa el esfuerzo en persona-meses.";
  } else if (parseEffort(values.effort) === null) {
    errors.effort = "Debe ser un número mayor que 0.";
  }
  return errors;
}

export function FeatureForm({ onAdd }: FeatureFormProps) {
  const formId = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [justAdded, setJustAdded] = useState(false);

  function fieldId(name: keyof FormValues) {
    return `${formId}-${name}`;
  }

  function setValue(name: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setJustAdded(false);
  }

  const reach = parseReach(values.reach);
  const impact = values.impact === "" ? null : Number(values.impact);
  const confidence = values.confidence === "" ? null : Number(values.confidence);
  const effort = parseEffort(values.effort);
  const liveScore =
    reach !== null && impact !== null && confidence !== null && effort !== null
      ? riceScore({ reach, impact, confidence, effort })
      : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      status: "idea",
      reach: reach as number,
      impact: impact as number,
      confidence: confidence as number,
      effort: effort as number,
    });
    setValues(EMPTY_VALUES);
    setErrors({});
    setJustAdded(true);
  }

  function errorText(name: keyof FormValues) {
    const message = errors[name];
    if (!message) return null;
    return (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p>
    );
  }

  const labelClass =
    "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Capturar feature
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Toda feature nueva entra con estado &ldquo;Idea&rdquo;.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={fieldId("title")} className={labelClass}>
            Título
          </label>
          <input
            id={fieldId("title")}
            type="text"
            value={values.title}
            onChange={(e) => setValue("title", e.target.value)}
            placeholder="Ej: Onboarding guiado para nuevos usuarios"
            className={`${inputClass} ${borderClass(Boolean(errors.title))}`}
          />
          {errorText("title")}
        </div>

        <div>
          <label htmlFor={fieldId("description")} className={labelClass}>
            Descripción{" "}
            <span className="font-normal text-zinc-400 dark:text-zinc-500">
              (opcional)
            </span>
          </label>
          <textarea
            id={fieldId("description")}
            value={values.description}
            onChange={(e) => setValue("description", e.target.value)}
            rows={3}
            placeholder="¿Qué problema resuelve y para quién?"
            className={`${inputClass} resize-y ${borderClass(false)}`}
          />
        </div>

        <div>
          <label htmlFor={fieldId("category")} className={labelClass}>
            Categoría
          </label>
          <input
            id={fieldId("category")}
            type="text"
            value={values.category}
            onChange={(e) => setValue("category", e.target.value)}
            placeholder="Ej: onboarding, checkout"
            className={`${inputClass} ${borderClass(Boolean(errors.category))}`}
          />
          {errorText("category")}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={fieldId("reach")} className={labelClass}>
              Reach
            </label>
            <input
              id={fieldId("reach")}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={values.reach}
              onChange={(e) => setValue("reach", e.target.value)}
              placeholder="Personas por trimestre"
              className={`${inputClass} ${borderClass(Boolean(errors.reach))}`}
            />
            {errorText("reach")}
          </div>

          <div>
            <label htmlFor={fieldId("effort")} className={labelClass}>
              Effort
            </label>
            <input
              id={fieldId("effort")}
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              value={values.effort}
              onChange={(e) => setValue("effort", e.target.value)}
              placeholder="Persona-meses"
              className={`${inputClass} ${borderClass(Boolean(errors.effort))}`}
            />
            {errorText("effort")}
          </div>

          <div>
            <label htmlFor={fieldId("impact")} className={labelClass}>
              Impact
            </label>
            <select
              id={fieldId("impact")}
              value={values.impact}
              onChange={(e) => setValue("impact", e.target.value)}
              className={`${inputClass} ${borderClass(Boolean(errors.impact))}`}
            >
              <option value="">Selecciona…</option>
              {IMPACT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorText("impact")}
          </div>

          <div>
            <label htmlFor={fieldId("confidence")} className={labelClass}>
              Confidence
            </label>
            <select
              id={fieldId("confidence")}
              value={values.confidence}
              onChange={(e) => setValue("confidence", e.target.value)}
              className={`${inputClass} ${borderClass(Boolean(errors.confidence))}`}
            >
              <option value="">Selecciona…</option>
              {CONFIDENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorText("confidence")}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Score RICE
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
            <FormulaTerm label="Reach" value={reach !== null ? String(reach) : null} />
            <Operator symbol="×" />
            <FormulaTerm
              label="Impact"
              value={impact !== null ? String(impact) : null}
            />
            <Operator symbol="×" />
            <FormulaTerm
              label="Confidence"
              value={confidence !== null ? String(confidence) : null}
            />
            <Operator symbol="÷" />
            <FormulaTerm
              label="Effort"
              value={effort !== null ? String(effort) : null}
            />
            <Operator symbol="=" />
            <span
              className={`text-2xl font-semibold ${
                liveScore !== null
                  ? "text-teal-700 dark:text-teal-400"
                  : "text-zinc-300 dark:text-zinc-600"
              }`}
            >
              {liveScore !== null ? formatScore(liveScore) : "—"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60 focus-visible:ring-offset-2 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus-visible:ring-offset-zinc-950"
        >
          Agregar feature
        </button>

        <p
          role="status"
          className={`text-center text-sm text-teal-700 dark:text-teal-400 ${
            justAdded ? "" : "invisible"
          }`}
        >
          Feature agregada al ranking.
        </p>
      </div>
    </form>
  );
}

function FormulaTerm({ label, value }: { label: string; value: string | null }) {
  return (
    <span className="flex flex-col items-center">
      <span className={value === null ? "text-zinc-300 dark:text-zinc-600" : ""}>
        {value ?? "—"}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
    </span>
  );
}

function Operator({ symbol }: { symbol: string }) {
  return (
    <span aria-hidden className="pb-3 text-zinc-400 dark:text-zinc-500">
      {symbol}
    </span>
  );
}
