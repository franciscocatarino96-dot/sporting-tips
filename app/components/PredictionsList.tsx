"use client";

import { useEffect, useState } from "react";

import { Prediction } from "@/app/lib/types";
import { getPredictionsByGame } from "@/app/lib/predictions";
import { users } from "@/app/lib/users";

type PredictionsListProps = {
  gameId: number;
  showPoints?: boolean;
};

function getFirstName(code: string) {
  const user = users.find((user) => user.code === code);

  return user ? user.name.split(" ")[0] : code;
}

export default function PredictionsList({
  gameId,
  showPoints = false,
}: PredictionsListProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    async function loadPredictions() {
      const data = await getPredictionsByGame(gameId);

      if (showPoints) {
        data.sort((a, b) => b.points - a.points);
      }

      setPredictions(data);
    }

    loadPredictions();
  }, [gameId, showPoints]);

  if (predictions.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-800 p-4 text-center text-sm text-zinc-400">
        Ainda ninguém submeteu um palpite.
      </div>
    );
  }

  return (
    <div className="mt-5">

      <h2 className="mb-3 text-base font-black text-white">
        Palpites
      </h2>

      <div className="space-y-2">

        {predictions.map((prediction) => (

          <div
            key={prediction.id}
            className="flex items-center justify-between rounded-lg bg-zinc-900 px-4 py-2.5"
          >

            {/* Utilizador */}

            <p className="w-24 text-sm font-bold text-white">
              {getFirstName(prediction.userCode)}
            </p>

            {/* Palpite */}

            <p className="text-base font-black text-white">
              {prediction.homeGoals} - {prediction.awayGoals}
            </p>

            {/* Pontos */}

            {showPoints ? (

              <p
                className={`w-12 text-right text-sm font-black ${
                  prediction.points === 7
                    ? "text-[#15803D]"
                    : prediction.points > 0
                    ? "text-yellow-400"
                    : "text-zinc-500"
                }`}
              >
                {prediction.points > 0
                  ? `+${prediction.points}`
                  : "—"}
              </p>

            ) : (

              <div className="w-12" />

            )}

          </div>

        ))}

      </div>

    </div>
  );
}