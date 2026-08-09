"use client";

import Image from "next/image";

type Props = {
  prediction: any;
  onDelete: (id: string, gameId: number) => void;
};

export default function PredictionCard({
  prediction,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-800 px-4 py-4">

      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {prediction.game.round} • {prediction.game.date} • {prediction.game.time}
      </p>

      <div className="grid grid-cols-3 items-center gap-3">

        <div className="flex flex-col items-center">
          <Image
            src={prediction.game.homeLogo}
            alt={prediction.game.homeTeam}
            width={44}
            height={44}
          />

          <p className="mt-2 text-center text-sm font-semibold">
            {prediction.game.homeTeam}
          </p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-black">
            {prediction.homeGoals} - {prediction.awayGoals}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Image
            src={prediction.game.awayLogo}
            alt={prediction.game.awayTeam}
            width={44}
            height={44}
          />

          <p className="mt-2 text-center text-sm font-semibold">
            {prediction.game.awayTeam}
          </p>
        </div>

      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-700 pt-3">

        {prediction.result ? (
          <p className="font-bold text-green-500">
            🟢 +{prediction.points} pontos
          </p>
        ) : (
          <p className="text-sm text-zinc-400">
            🟡 À espera do resultado
          </p>
        )}

        {prediction.predictionsOpen ? (
          <button
            onClick={() =>
              onDelete(prediction.id, prediction.gameId)
            }
            className="text-sm font-semibold text-red-400 transition hover:text-red-300"
          >
            🗑️ Apagar
          </button>
        ) : (
          <p className="text-sm font-semibold text-zinc-500">
            🔒 Palpites encerrados
          </p>
        )}

      </div>

    </div>
  );
}