"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { useAuth } from "../providers/AuthProvider";

import { games } from "../lib/games";
import { championsGames } from "../lib/championsGames";

import {
  saveResult,
  resetResult,
  getResult,
} from "../lib/results";

import { updatePoints } from "../lib/updatePoints";

import {
  resetPredictionPoints,
  resetPredictionHistory,
  closePredictions,
  openPredictions,
} from "../lib/predictions";

import {
  getGameSchedule,
  saveGameSchedule,
} from "../lib/gameSchedule";

import type { Competition } from "../lib/types";

type Result = {
  homeGoals: number;
  awayGoals: number;
};

export default function AdminPage() {
  const { user, loading } = useAuth();

  // =====================================================
  // COMPETIÇÃO
  // =====================================================

  const [competition, setCompetition] =
    useState<Competition>("liga");

  // =====================================================
  // JOGO SELECIONADO
  // =====================================================

  const [selectedGame, setSelectedGame] =
    useState(1);

  // =====================================================
  // RESULTADO
  // =====================================================

  const [homeGoals, setHomeGoals] =
    useState(0);

  const [awayGoals, setAwayGoals] =
    useState(0);

  const [saved, setSaved] =
    useState(false);

  const [results, setResults] =
    useState<Record<number, Result>>({});

  // =====================================================
  // EDIÇÃO
  // =====================================================

  const [editingGame, setEditingGame] =
    useState<number | null>(null);

  const [editingHomeGoals, setEditingHomeGoals] =
    useState(0);

  const [editingAwayGoals, setEditingAwayGoals] =
    useState(0);

  // =====================================================
  // LOADING
  // =====================================================

  const [loadingResults, setLoadingResults] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // DATA / HORA
  // =====================================================

  const [scheduleOpen, setScheduleOpen] =
    useState(false);

  const [scheduleDate, setScheduleDate] =
    useState("");

  const [scheduleTime, setScheduleTime] =
    useState("");

  const [savingSchedule, setSavingSchedule] =
    useState(false);

  // =====================================================
  // JOGOS DA COMPETIÇÃO
  // =====================================================

  const competitionGames =
    competition === "liga"
      ? games
      : championsGames;

  // =====================================================
  // CARREGAR RESULTADOS
  // =====================================================

  useEffect(() => {
    async function loadResults() {
      setLoadingResults(true);

      try {
        const loadedResults:
          Record<number, Result> = {};

        await Promise.all(
          competitionGames.map(
            async (game) => {
              const result =
                await getResult(
                  game.id,
                  competition
                );

              if (result) {
                loadedResults[game.id] = {
                  homeGoals:
                    result.homeGoals,
                  awayGoals:
                    result.awayGoals,
                };
              }
            }
          )
        );

        setResults(
          loadedResults
        );

        const firstPendingGame =
          competitionGames.find(
            (game) =>
              !loadedResults[
                game.id
              ]
          );

        if (firstPendingGame) {
          setSelectedGame(
            firstPendingGame.id
          );
        } else if (
          competitionGames.length > 0
        ) {
          setSelectedGame(
            competitionGames[0].id
          );
        }

        setEditingGame(null);
      } catch (error) {
        console.error(
          "Erro ao carregar resultados:",
          error
        );
      } finally {
        setLoadingResults(false);
      }
    }

    loadResults();
  }, [competition]);

  // =====================================================
  // CARREGAR DATA / HORA
  // =====================================================

  useEffect(() => {
    async function loadSchedule() {
      const game =
        competitionGames.find(
          (g) =>
            g.id === selectedGame
        );

      if (!game) {
        return;
      }

      try {
        const customSchedule =
          await getGameSchedule(
            selectedGame,
            competition
          );

        setScheduleDate(
          customSchedule?.date ??
            game.date
        );

        setScheduleTime(
          customSchedule?.time ??
            game.time
        );
      } catch (error) {
        console.error(
          "Erro ao carregar data/hora:",
          error
        );

        setScheduleDate(
          game.date
        );

        setScheduleTime(
          game.time
        );
      }
    }

    loadSchedule();
  }, [
    selectedGame,
    competition,
  ]);

  // =====================================================
  // JOGOS PENDENTES
  // =====================================================

  const pendingGames =
    competitionGames.filter(
      (game) =>
        !results[game.id]
    );

  // =====================================================
  // JOGOS COMPLETOS
  // =====================================================

  const completedGames =
    competitionGames.filter(
      (game) =>
        results[game.id]
    );

  // =====================================================
  // ALTERAR COMPETIÇÃO
  // =====================================================

  function handleCompetitionChange(
    newCompetition: Competition
  ) {
    setCompetition(
      newCompetition
    );

    setSelectedGame(1);

    setHomeGoals(0);
    setAwayGoals(0);

    setSaved(false);
    setEditingGame(null);

    setScheduleOpen(false);
    setScheduleDate("");
    setScheduleTime("");
  }

  // =====================================================
  // SELECIONAR JOGO
  // =====================================================

  function handleSelectGame(
    gameId: number
  ) {
    setSelectedGame(gameId);

    setHomeGoals(0);
    setAwayGoals(0);

    setSaved(false);
    setScheduleOpen(false);
  }

  // =====================================================
  // ABRIR DATA / HORA
  // =====================================================

  function handleOpenSchedule() {
    setScheduleOpen(
      (previous) => !previous
    );
  }

  // =====================================================
  // GUARDAR DATA / HORA
  // =====================================================

  async function handleSaveSchedule() {
    if (
      !scheduleDate ||
      !scheduleTime
    ) {
      alert(
        "⚠️ Escolhe uma data e uma hora."
      );

      return;
    }

    setSavingSchedule(true);

    try {
      await saveGameSchedule(
        selectedGame,
        scheduleDate,
        scheduleTime,
        competition
      );

      setScheduleOpen(false);

      alert(
        "✅ Data e hora atualizadas com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao guardar data/hora:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      }
    } finally {
      setSavingSchedule(
        false
      );
    }
  }

  // =====================================================
  // GUARDAR RESULTADO
  // =====================================================

  async function handleSave() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const savedGameId =
        selectedGame;

      const savedResult: Result =
        {
          homeGoals,
          awayGoals,
        };

      // -------------------------------------------------
      // 1. GUARDAR RESULTADO
      // -------------------------------------------------

      await saveResult(
        savedGameId,
        homeGoals,
        awayGoals,
        competition
      );

      // -------------------------------------------------
      // 2. ATUALIZAR INTERFACE
      // -------------------------------------------------

      setResults(
        (previous) => ({
          ...previous,
          [savedGameId]:
            savedResult,
        })
      );

      setSaved(true);

      // -------------------------------------------------
      // 3. ENCONTRAR PRÓXIMO JOGO
      // -------------------------------------------------

      const nextGame =
        competitionGames.find(
          (game) =>
            game.id !==
              savedGameId &&
            !results[game.id]
        );

      if (nextGame) {
        setSelectedGame(
          nextGame.id
        );

        setHomeGoals(0);
        setAwayGoals(0);
      }

      // -------------------------------------------------
      // 4. ATUALIZAR PONTOS
      // -------------------------------------------------

      try {
        await updatePoints(
          savedGameId,
          competition
        );
      } catch (
        pointsError
      ) {
        console.error(
          "Erro ao atualizar pontos:",
          pointsError
        );

        alert(
          "⚠️ Resultado guardado, mas houve um problema ao atualizar os pontos."
        );
      }

      setTimeout(() => {
        setSaved(false);
      }, 2000);

    } catch (error) {
      console.error(
        "ERRO AO GUARDAR RESULTADO:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(
          `❌ Não foi possível guardar o resultado.\n\n${error.message}`
        );
      } else {
        alert(
          "❌ Não foi possível guardar o resultado."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // FECHAR PALPITES
  // =====================================================

  async function handleClosePredictions() {
    try {
      await closePredictions(
        selectedGame,
        competition
      );

      alert(
        "🔒 Palpites fechados com sucesso!"
      );
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      }
    }
  }

  // =====================================================
  // ABRIR PALPITES
  // =====================================================

  async function handleOpenPredictions() {
    try {
      await openPredictions(
        selectedGame,
        competition
      );

      alert(
        "🔓 Palpites abertos com sucesso!"
      );
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      }
    }
  }

  // =====================================================
  // EDITAR JOGO COMPLETO
  // =====================================================

  function handleEditGame(
    gameId: number
  ) {
    const result =
      results[gameId];

    if (!result) {
      return;
    }

    setEditingGame(
      gameId
    );

    setEditingHomeGoals(
      result.homeGoals
    );

    setEditingAwayGoals(
      result.awayGoals
    );
  }

  // =====================================================
  // GUARDAR ALTERAÇÃO DO RESULTADO
  // =====================================================

  async function handleSaveEdit() {
    if (
      editingGame === null
    ) {
      return;
    }

    const gameId =
      editingGame;

    try {
      await saveResult(
        gameId,
        editingHomeGoals,
        editingAwayGoals,
        competition
      );

      setResults(
        (previous) => ({
          ...previous,
          [gameId]: {
            homeGoals:
              editingHomeGoals,
            awayGoals:
              editingAwayGoals,
          },
        })
      );

      setEditingGame(
        null
      );

      try {
        await updatePoints(
          gameId,
          competition
        );
      } catch (
        pointsError
      ) {
        console.error(
          "Erro ao atualizar pontos:",
          pointsError
        );

        alert(
          "⚠️ Resultado alterado, mas houve um problema ao atualizar os pontos."
        );

        return;
      }

      alert(
        "✅ Resultado atualizado com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao alterar resultado:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      }
    }
  }

  // =====================================================
  // REPOR JOGO
  // =====================================================

  async function handleReset(
    gameId: number
  ) {
    const game =
      competitionGames.find(
        (item) =>
          item.id === gameId
      );

    const confirmReset =
      window.confirm(
        `⚠️ Tens a certeza que queres repor ${game?.round}?\n\nO resultado, os pontos e o histórico desta jornada serão apagados.`
      );

    if (!confirmReset) {
      return;
    }

    try {
      await resetResult(
        gameId,
        competition
      );

      await resetPredictionPoints(
        gameId,
        competition
      );

      await resetPredictionHistory(
        gameId,
        competition
      );

      setResults(
        (previous) => {
          const updated = {
            ...previous,
          };

          delete updated[
            gameId
          ];

          return updated;
        }
      );

      setEditingGame(
        null
      );

      setSelectedGame(
        gameId
      );

      setHomeGoals(0);
      setAwayGoals(0);

      alert(
        "✅ Jogo reposto com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao repor jogo:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      }
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading ||
    loadingResults
  ) {
    return null;
  }

  // =====================================================
  // ACESSO
  // =====================================================

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

  // =====================================================
  // PÁGINA
  // =====================================================

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

          {/* ================================================= */}
          {/* COMPETIÇÃO */}
          {/* ================================================= */}

          <div className="mb-4 grid grid-cols-2 gap-2">

            <button
              onClick={() =>
                handleCompetitionChange(
                  "liga"
                )
              }
              className={`rounded-xl py-3 text-sm font-bold transition ${
                competition ===
                "liga"
                  ? "bg-zinc-600 text-white shadow-md"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              🇵🇹 Liga Portugal
            </button>

            <button
              onClick={() =>
                handleCompetitionChange(
                  "champions"
                )
              }
              className={`rounded-xl py-3 text-sm font-bold transition ${
                competition ===
                "champions"
                  ? "bg-zinc-600 text-white shadow-md"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              ⭐ Champions League
            </button>

          </div>

          {/* ================================================= */}
          {/* JOGOS PENDENTES */}
          {/* ================================================= */}

          <div className="rounded-xl border border-zinc-800 bg-zinc-800 p-4">

            <div className="mb-3 flex items-center justify-between">

              <label className="block text-xs font-semibold text-zinc-400">
                Selecionar jogo
              </label>

              <span className="text-[10px] font-bold uppercase text-zinc-500">
                {competition ===
                "liga"
                  ? "Liga"
                  : "Champions"}
              </span>

            </div>

            {pendingGames.length >
            0 ? (

              <>

                <select
                  value={
                    selectedGame
                  }
                  onChange={(e) =>
                    handleSelectGame(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                >

                  {pendingGames.map(
                    (game) => (

                      <option
                        key={
                          game.id
                        }
                        value={
                          game.id
                        }
                      >
                        {game.round} •{" "}
                        {
                          game.homeTeam
                        }{" "}
                        vs{" "}
                        {
                          game.awayTeam
                        }
                      </option>

                    )
                  )}

                </select>

                <div className="mt-4 grid grid-cols-3 items-center gap-2">

                  <input
                    type="number"
                    min="0"
                    value={
                      homeGoals
                    }
                    onChange={(e) =>
                      setHomeGoals(
                        Number(
                          e.target
                            .value
                        )
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
                    value={
                      awayGoals
                    }
                    onChange={(e) =>
                      setAwayGoals(
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    className="rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-center text-xl font-bold"
                  />

                </div>

                {/* GUARDAR RESULTADO */}

                <button
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving
                  }
                  className="mt-4 w-full rounded-lg bg-[#0B5E3C] py-2.5 text-sm font-bold text-white transition hover:bg-[#0F7148] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "⏳ A guardar..."
                    : "💾 Guardar Resultado"}
                </button>

                {/* FECHAR PALPITES */}

                <button
                  onClick={
                    handleClosePredictions
                  }
                  className="mt-3 w-full rounded-lg bg-zinc-700 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-600"
                >
                  🔒 Fechar Palpites
                </button>

                {/* ABRIR PALPITES */}

                <button
                  onClick={
                    handleOpenPredictions
                  }
                  className="mt-3 w-full rounded-lg bg-green-700 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
                >
                  🔓 Abrir Palpites
                </button>

                {/* REPOR JOGO */}

                <button
                  onClick={() =>
                    handleReset(
                      selectedGame
                    )
                  }
                  className="mt-3 w-full rounded-lg bg-red-700 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  🗑️ Repor Jogo
                </button>

                {/* DATA / HORA */}

                <button
                  onClick={
                    handleOpenSchedule
                  }
                  className="mt-3 w-full rounded-lg bg-zinc-700 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-600"
                >
                  🕐 Alterar Data/Hora
                </button>

                {scheduleOpen && (

                  <div className="mt-3 rounded-lg bg-zinc-900 p-4">

                    <p className="mb-3 text-center text-sm font-bold text-white">
                      Alterar Data/Hora
                    </p>

                    <label className="mb-1 block text-xs font-semibold text-zinc-400">
                      Data
                    </label>

                    <input
                      type="date"
                      value={
                        scheduleDate
                      }
                      onChange={(e) =>
                        setScheduleDate(
                          e.target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                    />

                    <label className="mb-1 mt-3 block text-xs font-semibold text-zinc-400">
                      Hora de Portugal
                    </label>

                    <input
                      type="time"
                      value={
                        scheduleTime
                      }
                      onChange={(e) =>
                        setScheduleTime(
                          e.target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                    />

                    <button
                      onClick={
                        handleSaveSchedule
                      }
                      disabled={
                        savingSchedule
                      }
                      className="mt-3 w-full rounded-lg bg-[#0B5E3C] py-2.5 text-sm font-bold text-white transition hover:bg-[#0F7148] disabled:opacity-50"
                    >
                      {savingSchedule
                        ? "⏳ A guardar..."
                        : "💾 Guardar Data/Hora"}
                    </button>

                  </div>

                )}

                {saved && (

                  <div className="mt-4 rounded-lg bg-[#0B5E3C] py-2 text-center text-sm font-semibold">
                    ✅ Resultado guardado!
                  </div>

                )}

              </>

            ) : (

              <div className="rounded-lg bg-zinc-900 p-4 text-center text-sm text-zinc-400">
                Todos os jogos têm resultado.
              </div>

            )}

          </div>

          {/* ================================================= */}
          {/* JOGOS COMPLETOS */}
          {/* ================================================= */}

          {completedGames.length >
            0 && (

            <div className="mt-6">

              <h2 className="mb-3 text-xs font-semibold text-zinc-400">
                Jogos completos
              </h2>

              <div className="space-y-1">

                {completedGames.map(
                  (game) => {

                    const result =
                      results[
                        game.id
                      ];

                    const isEditing =
                      editingGame ===
                      game.id;

                    return (

                      <div
                        key={
                          game.id
                        }
                      >

                        <button
                          onClick={() =>
                            isEditing
                              ? setEditingGame(
                                  null
                                )
                              : handleEditGame(
                                  game.id
                                )
                          }
                          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-left text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >

                          <div className="flex items-center justify-between">

                            <span>
                              {game.round}{" "}
                              - COMPLETO
                            </span>

                            <span>
                              {
                                result.homeGoals
                              }{" "}
                              -{" "}
                              {
                                result.awayGoals
                              }
                            </span>

                          </div>

                        </button>

                        {isEditing && (

                          <div className="mt-1 rounded-lg bg-zinc-800 p-4">

                            <p className="mb-3 text-center text-xs text-zinc-400">
                              {
                                game.homeTeam
                              }{" "}
                              vs{" "}
                              {
                                game.awayTeam
                              }
                            </p>

                            <div className="grid grid-cols-3 items-center gap-2">

                              <input
                                type="number"
                                min="0"
                                value={
                                  editingHomeGoals
                                }
                                onChange={(e) =>
                                  setEditingHomeGoals(
                                    Number(
                                      e
                                        .target
                                        .value
                                    )
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
                                value={
                                  editingAwayGoals
                                }
                                onChange={(e) =>
                                  setEditingAwayGoals(
                                    Number(
                                      e
                                        .target
                                        .value
                                    )
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-center text-xl font-bold"
                              />

                            </div>

                            <button
                              onClick={
                                handleSaveEdit
                              }
                              className="mt-3 w-full rounded-lg bg-[#0B5E3C] py-2.5 text-sm font-bold text-white transition hover:bg-[#0F7148]"
                            >
                              ✏️ Guardar Alteração
                            </button>

                            <button
                              onClick={() =>
                                handleReset(
                                  game.id
                                )
                              }
                              className="mt-3 w-full rounded-lg bg-red-700 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                            >
                              🗑️ Repor Jogo
                            </button>

                          </div>

                        )}

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}