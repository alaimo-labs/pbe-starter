import Image from "next/image";
import { FeatureBoard } from "@/components/feature-board";

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Priorizador de Features
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Captura ideas y puntúalas con RICE. Por ahora los datos viven en
              memoria: se pierden al recargar la página.
            </p>
          </div>
          <Image
            src="/alaimo-labs-logo.svg"
            alt="Alaimo Labs"
            width={140}
            height={20}
            priority
            className="mt-1 hidden shrink-0 sm:block dark:invert"
          />
        </header>
        <FeatureBoard />
      </div>
    </main>
  );
}
