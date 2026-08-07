"use client";

import { useEffect, useState } from "react";
import {
  savePrediction,
  getPrediction,
} from "@/app/lib/predictions";
import { useAuth } from "@/app/providers/AuthProvider";

type PredictionFormProps = {
  gameId: number;
};

export default function PredictionForm({
  gameId,
}: PredictionFormProps) {
  const { user, loading } = useAuth();

  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadPrediction() {
      if (loading || !user) return;

      const prediction = await getPrediction(
        user.code,
        gameId
      );

      if (!prediction) return;

      setHomeGoals(prediction.homeGoals);
      setAwayGoals(prediction.awayGoals);
    }

    loadPrediction();
  }, [gameId, user, loading]);

  async function handleSavePrediction() {
    if (!user) {
      alert("Utilizador não encontrado.");
      return;
    }

    try {
      await savePrediction(
        user.code,
        user.name,
        gameId,
        1,
        homeGoals,
        awayGoals
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          min="0"
          value={homeGoals}
          onChange={(e) => setHomeGoals(Number(e.target.value))}
          className="rounded-xl bg-zinc-900 p-4 text-center text-4xl font-black outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          min="0"
          value={awayGoals}
          onChange={(e) => setAwayGoals(Number(e.target.value))}
          className="rounded-xl bg-zinc-900 p-4 text-center text-4xl font-black outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={handleSavePrediction}
        className="mt-8 w-full rounded-xl bg-green-600 py-4 text-xl font-bold transition hover:bg-green-500"
      >
        Guardar Palpite
      </button>

      {saved && (
        <p className="mt-4 text-center font-bold text-green-400">
          ✅ Palpite guardado!
        </p>
      )}
    </div>
  );
}