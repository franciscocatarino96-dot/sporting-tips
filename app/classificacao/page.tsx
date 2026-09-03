"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { getLeaderboard } from "../lib/leaderboard";
import { useAuth } from "../providers/AuthProvider";

export default function ClassificacaoPage() {
  const { user, loading: authLoading } = useAuth();

  const [leaderboard, setLeaderboard] = useState<
    Awaited<ReturnType<typeof getLeaderboard>>
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getLeaderboard();

        setLeaderboard(data);
      } catch (err) {
        console.error(
          "ERRO AO CARREGAR CLASSIFICAÇÃO:",
          err
        );

        setError(
          "Não foi possível carregar a classificação."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [user, authLoading]);

  return (
    <main className="min-h-screen bg-zinc-900 text-white">

      <div className="mx-auto max-w-5xl px-4">

        <Header />

        <hr className="border-zinc-800" />

        <Navbar />

        <div className="py-6">

          <h1 className="mb-6 text-2xl font-black">
            🏆 Classificação
          </h1>

          {authLoading || loading ? (

            <div className="rounded-xl bg-zinc-800 p-6 text-center text-zinc-400">
              A carregar classificação...
            </div>

          ) : !user ? (

            <div className="rounded-xl bg-zinc-800 p-6 text-center text-zinc-400">
              Sessão não encontrada.
            </div>

          ) : error ? (

            <div className="rounded-xl bg-red-950 p-6 text-center text-red-400">
              {error}
            </div>

          ) : (

            <div className="space-y-3">

              {leaderboard.map((player) => {

                const initials = player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                let badge = "bg-zinc-700";
                let medal = "";

                if (player.position === 1) {
                  badge = "bg-yellow-500 text-black";
                  medal = "🥇";
                } else if (player.position === 2) {
                  badge = "bg-zinc-300 text-black";
                  medal = "🥈";
                } else if (player.position === 3) {
                  badge = "bg-amber-700";
                  medal = "🥉";
                }

                return (

                  <div
                    key={player.code}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800 px-4 py-3 transition hover:border-zinc-600"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-7 text-center text-lg">
                        {medal || `${player.position}.`}
                      </div>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${badge}`}
                      >
                        {initials}
                      </div>

                      <div>

                        <p className="text-sm font-bold">
                          {player.name}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {player.position}º lugar
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-xl font-black text-[#15803D]">
                        {player.points}
                      </p>

                      <p className="text-xs text-zinc-500">
                        pontos
                      </p>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}