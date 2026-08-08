"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import { getMyPredictions } from "@/app/lib/predictions";
import PredictionCard from "./PredictionCard";

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
    <div className="mt-5 space-y-4">

    <div className="space-y-4">
      {predictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          prediction={prediction}
        />
      ))}
    </div>

  </div>
);
}