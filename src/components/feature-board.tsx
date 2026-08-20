"use client";

import { useMemo, useState } from "react";
import { Feature, riceScore } from "@/lib/rice";
import { FeatureForm } from "@/components/feature-form";
import { FeatureList } from "@/components/feature-list";

export function FeatureBoard() {
  const [features, setFeatures] = useState<Feature[]>([]);

  const ranked = useMemo(
    () => [...features].sort((a, b) => riceScore(b) - riceScore(a)),
    [features],
  );

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[400px_minmax(0,1fr)]">
      <FeatureForm
        onAdd={(feature) => setFeatures((prev) => [...prev, feature])}
      />
      <FeatureList features={ranked} />
    </div>
  );
}
