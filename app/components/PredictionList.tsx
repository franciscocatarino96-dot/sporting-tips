"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/lib/auth";

import {
  getMyPredictions,
  getPredictionHistory,
  deletePrediction,
} from "@/app/lib/predictions";

import PredictionCard from "./PredictionCard";

export default function PredictionList() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadPredictions() {
      const user = getCurrentUser();

      if (!user) return;

      const data = await getMyPredictions(user.code);

      const historyData = await getPredictionHistory(
        user.code
      );
      console.log("UTILIZADOR ATUAL:", user.code);
console.log("HISTÓRICO RECEBIDO:", historyData);

      // Palpites que ainda não têm resultado
      const activePredictions = data
        .filter((prediction) => !prediction.result)
        .sort(
          (a, b) => a.game.id - b.game.id
        );

      setPredictions(activePredictions);
      setHistory(historyData);
    }

    loadPredictions();
  }, []);

  async function handleDelete(
    id: string,
    gameId: number
  ) {
    const confirmDelete = window.confirm(
      "Queres apagar este palpite?"
    );

    if (!confirmDelete) return;

    await deletePrediction(id, gameId);

    setPredictions((prev) =>
      prev.filter(
        (prediction) => prediction.id !== id
      )
    );
  }

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* HISTÓRICO */}
      {/* ================================================= */}

      {history.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-black">
            📋 Histórico
          </h2>

          <div className="overflow-hidden rounded-xl bg-zinc-800">

            {history.map(
              (item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${
                    index !== history.length - 1
                      ? "border-b border-zinc-700"
                      : ""
                  }`}
                >

                  <span className="font-semibold text-zinc-400">
                    {String(item.round).startsWith("J")
                      ? item.round
                     : `J${item.round}`}
                  </span>

                  <span className="font-bold">
                    {item.homeGoals} -{" "}
                    {item.awayGoals}
                  </span>

                  <span className="font-bold text-green-500">
                    +{item.points} pts
                  </span>

                </div>
              )
            )}

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* PALPITES ATUAIS */}
      {/* ================================================= */}

      {predictions.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-black">
            🎯 Palpites
          </h2>

          <div className="space-y-4">

            {predictions.map(
              (prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  onDelete={() =>
                    handleDelete(
                      prediction.id,
                      prediction.gameId
                    )
                  }
                />
              )
            )}

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* NENHUM PALPITE */}
      {/* ================================================= */}

      {history.length === 0 &&
        predictions.length === 0 && (
          <p className="text-center text-zinc-400">
            Ainda não fizeste nenhum palpite.
          </p>
        )}

    </div>
  );
}