"use client";

import { useEffect, useState } from "react";
import {
  savePrediction,
  getPrediction,
} from "@/app/lib/predictions";
import { useAuth } from "@/app/providers/AuthProvider";

type PredictionFormProps = {
  gameId: number;
  competition?: "liga" | "champions";
};

export default function PredictionForm({
  gameId,
  competition = "liga",
}: PredictionFormProps) {
  const { user, loading } = useAuth();

  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [saved, setSaved] = useState(false);

  const [hasPrediction, setHasPrediction] = useState(false);

  useEffect(() => {
    async function loadPrediction() {
      if (loading || !user) return;

      const prediction = await getPrediction(
  user.code,
  gameId,
  competition
);

      if (!prediction) {
        setHasPrediction(false);
        setHomeGoals("");
        setAwayGoals("");
        return;
      }

      setHomeGoals(String(prediction.homeGoals));
      setAwayGoals(String(prediction.awayGoals));
      setHasPrediction(true);
    }

    loadPrediction();
  }, [gameId, user, loading]);

  async function handleSavePrediction() {
    if (!user) {
      alert("Utilizador não encontrado.");
      return;
    }

    if (homeGoals === "" || awayGoals === "") {
      alert("Preenche os dois resultados.");
      return;
    }

    const home = Number(homeGoals);
    const away = Number(awayGoals);

    if (hasPrediction) {
      const confirmChange = window.confirm(
        `Vais alterar o teu palpite.\n\n` +
        `Novo palpite: ${home} - ${away}\n\n` +
        `Tens a certeza?`
      );

      if (!confirmChange) return;
    }

    try {
      await savePrediction(
  user.code,
  user.name,
  gameId,
  home,
  away,
  competition
);

      setHasPrediction(true);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="mt-6">

      <div className="grid grid-cols-2 gap-4">

        <input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Casa"
          value={homeGoals}
          onChange={(e) =>
            setHomeGoals(e.target.value)
          }
          className="rounded-xl bg-zinc-900 p-4 text-center text-4xl font-black outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Fora"
          value={awayGoals}
          onChange={(e) =>
            setAwayGoals(e.target.value)
          }
          className="rounded-xl bg-zinc-900 p-4 text-center text-4xl font-black outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      <button
        onClick={handleSavePrediction}
        className="mt-8 w-full rounded-xl bg-green-600 py-4 text-xl font-bold transition hover:bg-green-500"
      >
        {hasPrediction
          ? "✏️ Alterar Palpite"
          : "Guardar Palpite"}
      </button>

      {saved && (
        <p className="mt-4 text-center font-bold text-green-400">
          ✅ Palpite guardado!
        </p>
      )}

    </div>
  );
}