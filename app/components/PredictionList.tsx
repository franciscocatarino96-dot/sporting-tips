"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import { getMyPredictions } from "@/app/lib/predictions";

export default function PredictionList() {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    async function loadPredictions() {
      const user = getCurrentUser();

      if (!user) return;

      const data = await getMyPredictions(user.code);

      data.sort((a, b) => a.round - b.round);

      setPredictions(data);
    }

    loadPredictions();
  }, []);

  if (predictions.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-800 p-5 text-center text-zinc-400">
        Ainda não fizeste nenhum palpite.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">

      {predictions.map((prediction) => (

        <div
          key={prediction.id}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800 px-4 py-3 transition-all duration-200 hover:border-zinc-600"
        >

          <div>

            <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
              J{prediction.round}
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {prediction.homeGoals} - {prediction.awayGoals}
            </p>

          </div>

          <div className="text-right">

            {prediction.points > 0 ? (

              <>
                <p className="text-2xl font-black text-[#15803D]">
                  +{prediction.points}
                </p>

                <p className="text-[11px] text-zinc-500">
                  pontos
                </p>
              </>

            ) : (

              <>
                <p className="text-xl">
                  ⏳
                </p>

                <p className="text-[11px] text-zinc-500">
                  Aguarda
                </p>
              </>

            )}

          </div>

        </div>

      ))}

    </div>
  );
}