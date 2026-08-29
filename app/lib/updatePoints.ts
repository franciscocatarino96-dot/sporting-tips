import { getResult } from "./results";

import {
  getPredictionsByGame,
  updatePredictionPoints,
  savePredictionHistory,
} from "./predictions";

import { calculatePoints } from "./calculatePoints";

import { games } from "./games";
import { championsGames } from "./championsGames";

import { Competition } from "./types";

export async function updatePoints(
  gameId: number,
  competition: Competition = "liga"
) {
  // =====================================================
  // RESULTADO
  // =====================================================

  const result = await getResult(
    gameId,
    competition
  );

  if (!result) {
    return;
  }

  // =====================================================
  // JOGO
  // =====================================================

  const game =
    competition === "liga"
      ? games.find(
          (g) => g.id === gameId
        )
      : championsGames.find(
          (g) => g.id === gameId
        );

  if (!game) {
    return;
  }

  // =====================================================
  // SPORTING CASA/FORA
  // =====================================================

  const sportingHome =
    game.homeTeam === "Sporting CP";

  // =====================================================
  // OBTER PALPITES
  // =====================================================

  const predictions =
    await getPredictionsByGame(
      gameId,
      competition
    );

  console.log(
    "================================="
  );

  console.log(
    "ATUALIZAR JOGO:",
    gameId,
    competition
  );

  console.log(
    "RESULTADO:",
    result
  );

  console.log(
    "PALPITES:",
    predictions
  );

  console.log(
    "================================="
  );

  // =====================================================
  // CALCULAR PONTOS
  // =====================================================

  for (const prediction of predictions) {
    const points =
      calculatePoints(
        {
          homeGoals:
            prediction.homeGoals,

          awayGoals:
            prediction.awayGoals,
        },

        {
          homeGoals:
            result.homeGoals,

          awayGoals:
            result.awayGoals,
        },

        sportingHome
      );

    // ===============================================
    // ATUALIZAR PONTOS
    // ===============================================

    await updatePredictionPoints(
      prediction.id,
      points
    );

    // ===============================================
    // GUARDAR HISTÓRICO
    // ===============================================

    await savePredictionHistory(
      prediction,
      points,
      competition
    );
  }
}