export type FeatureStatus =
  | "idea"
  | "en_evaluacion"
  | "priorizada"
  | "en_desarrollo"
  | "lanzada";

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: FeatureStatus;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
}

export const IMPACT_OPTIONS = [
  { value: 0.25, label: "0.25 — Mínimo" },
  { value: 0.5, label: "0.5 — Bajo" },
  { value: 1, label: "1 — Medio" },
  { value: 2, label: "2 — Alto" },
  { value: 3, label: "3 — Masivo" },
] as const;

export const CONFIDENCE_OPTIONS = [
  { value: 0.5, label: "0.5 — Baja" },
  { value: 0.8, label: "0.8 — Media" },
  { value: 1, label: "1.0 — Alta" },
] as const;

export const STATUS_LABELS: Record<FeatureStatus, string> = {
  idea: "Idea",
  en_evaluacion: "En evaluación",
  priorizada: "Priorizada",
  en_desarrollo: "En desarrollo",
  lanzada: "Lanzada",
};

export function riceScore(
  values: Pick<Feature, "reach" | "impact" | "confidence" | "effort">,
): number {
  return (values.reach * values.impact * values.confidence) / values.effort;
}

const scoreFormatter = new Intl.NumberFormat("es", {
  maximumFractionDigits: 1,
});

export function formatScore(score: number): string {
  return scoreFormatter.format(score);
}
