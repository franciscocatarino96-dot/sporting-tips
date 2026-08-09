"use client";

import { useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { useAuth } from "../providers/AuthProvider";
import { games } from "../lib/games";
import { saveResult, resetResult } from "../lib/results";
import { updatePoints } from "../lib/updatePoints";

import {
  resetPredictionPoints,
  resetPredictionHistory,
  closePredictions,
  openPredictions,
} from "../lib/predictions";

export default function AdminPage() {
  const { user, loading } = useAuth();

  const [selectedGame, setSelectedGame] = useState(1);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [saved, setSaved] = useState(false);

  if (loading) {
    return null;
  }

  if (!user?.admin) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-center text-xl font-black">
            Acesso negado
          </h1>
        </div>
      </main>
    );
  }

  async function handleSave() {
    try {
      await saveResult(
        selectedGame,
        homeGoals,
        awayGoals
      );

      await updatePoints(selectedGame);

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

  async function handleClosePredictions() {
    try {
      await closePredictions(selectedGame);

      alert("🔒 Palpites fechados com sucesso!");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function handleOpenPredictions() {
    try {
      await openPredictions(selectedGame);

      alert("🔓 Palpites abertos com sucesso!");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function handleReset() {
    const confirmReset = window.confirm(
      "⚠️ Tens a certeza que queres repor este jogo?\n\nO resultado, os pontos e o histórico desta jornada serão apagados."
    );

    if (!confirmReset) {
      return;
    }

    try {
      // Apagar resultado
      await resetResult(selectedGame);

      // Repor pontos dos palpites
      await resetPredictionPoints(selectedGame);

      // Apagar histórico desta jornada
      await resetPredictionHistory(selectedGame);

      setHomeGoals(0);
      setAwayGoals(0);
      setSaved(false);

      alert("✅ Jogo reposto com sucesso!");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4">

        <Header />

        <hr className="border-zinc-800" />

        <Navbar />

        <div className="py-5">

          <h1 className="mb-4 text-xl font-black">
            🛠️ Administração
          </h1>

          <div className="rounded-xl border border-zinc-800 bg-zinc-800 p-4">

            <label className="mb-2 block text-xs font-semibold text-zinc-400">
              Selecionar jogo
            </label>

            <select
              value={selectedGame}
              onChange={(e) =>
                setSelectedGame(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              {games.map((game) => (
                <option
                  key={game.id}
                  value={game.id}
                >
                  {game.round} • {game.homeTeam} vs{" "}
                  {game.awayTeam}
                </option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-3 items-center gap-2">

              <input
                type="number"
                min="0"
                value={homeGoals}
                onChange={(e) =>
                  setHomeGoals(
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-center text-xl font-bold"
              />

              <p className="text-center text-xl font-black text-zinc-500">
                -
              </p>

              <input
                type="number"
                min="0"
                value={awayGoals}
                onChange={(e) =>
                  setAwayGoals(
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-center text-xl font-bold"
              />

            </div>

            {/* GUARDAR RESULTADO */}

            <button
              onClick={handleSave}
              className="mt-4 w-full rounded-lg bg-[#0B5E3C] py-2.5 text-sm font-bold text-white transition hover:bg-[#0F7148]"
            >
              💾 Guardar Resultado
            </button>

            {/* FECHAR PALPITES */}

            <button
              onClick={handleClosePredictions}
              className="mt-3 w-full rounded-lg bg-zinc-700 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-600"
            >
              🔒 Fechar Palpites
            </button>

            {/* ABRIR PALPITES */}

            <button
              onClick={handleOpenPredictions}
              className="mt-3 w-full rounded-lg bg-green-700 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
            >
              🔓 Abrir Palpites
            </button>

            {/* REPOR JOGO */}

            <button
              onClick={handleReset}
              className="mt-3 w-full rounded-lg bg-red-700 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
            >
              🗑️ Repor Jogo
            </button>

            {saved && (
              <div className="mt-4 rounded-lg bg-[#0B5E3C] py-2 text-center text-sm font-semibold">
                ✅ Resultado guardado!
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}