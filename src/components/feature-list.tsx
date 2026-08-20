import { Feature, STATUS_LABELS, formatScore, riceScore } from "@/lib/rice";

interface FeatureListProps {
  features: Feature[];
}

export function FeatureList({ features }: FeatureListProps) {
  if (features.length === 0) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="font-medium text-zinc-700 dark:text-zinc-300">
          Todavía no capturaste ninguna feature
        </p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Completa el formulario para agregar la primera. El ranking se ordena
          por score RICE, de mayor a menor.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Ranking
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {features.length === 1
            ? "1 feature"
            : `${features.length} features`}{" "}
          · por score RICE
        </p>
      </div>
      <ol className="space-y-3">
        {features.map((feature, index) => (
          <li
            key={feature.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="font-mono text-sm tabular-nums text-zinc-400 dark:text-zinc-500">
                  {index + 1}
                </span>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
              </div>
              <span className="shrink-0 font-mono text-lg font-semibold tabular-nums text-teal-700 dark:text-teal-400">
                {formatScore(riceScore(feature))}
              </span>
            </div>

            {feature.description !== "" && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {feature.category}
              </span>
              <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                {STATUS_LABELS[feature.status]}
              </span>
              <span className="ml-auto font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                R {feature.reach} · I {feature.impact} · C {feature.confidence}{" "}
                · E {feature.effort}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
