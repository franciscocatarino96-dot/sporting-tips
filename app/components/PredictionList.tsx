"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import {
  getMyPredictions,
  deletePrediction,
} from "@/app/lib/predictions";
import PredictionCard from "./PredictionCard";

export default function PredictionList() {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    async function loadPredictions() {
      const user = getCurrentUser();

      if (!user) return;

      const data = await getMyPredictions(user.code);

      data.sort((a, b) => a.game.id - b.game.id);

      setPredictions(data);
    }

    loadPredictions();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Queres apagar este palpite?"
    );

    if (!confirmDelete) return;

    await deletePrediction(id);

    setPredictions((prev) =>
      prev.filter((prediction) => prediction.id !== id)
    );
  }

  if (predictions.length === 0) {
    return (
      <p className="text-center text-zinc-400">
        Ainda não fizeste nenhum palpite.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          prediction={prediction}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}