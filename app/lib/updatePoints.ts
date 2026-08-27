import { getResult } from "./results";

import {
  getPredictionsByGame,
  updatePredictionPoints,
  savePredictionHistory,
} from "./predictions";

import { calculatePoints } from "./calculatePoints";
import { games } from "./games";

export async function updatePoints(gameId: number) {
  const result = await getResult(gameId);

  if (!result) {
    return;
  }

  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return;
  }

  const sportingHome = game.homeTeam === "Sporting CP";

  const predictions = await getPredictionsByGame(gameId);
  console.log("=================================");
console.log("ATUALIZAR JOGO:", gameId);
console.log("RESULTADO:", result);
console.log("PALPITES:", predictions);

for (const prediction of predictions) {
  console.log(
    prediction.userCode,
    "PALPITE:",
    prediction.homeGoals,
    "-",
    prediction.awayGoals,
    "PONTOS ANTES:",
    prediction.points
  );
}
console.log("=================================");

  console.log("JOGO:", gameId);
console.log("PALPITES ENCONTRADOS:", predictions);

  for (const prediction of predictions) {
    console.log(
    "GUARDAR HISTÓRICO:",
    prediction.userCode,
    prediction.gameId,
    prediction.homeGoals,
    prediction.awayGoals
    );
    
    const points = calculatePoints(
      {
        homeGoals: prediction.homeGoals,
        awayGoals: prediction.awayGoals,
      },
      {
        homeGoals: result.homeGoals,
        awayGoals: result.awayGoals,
      },
      sportingHome
    );

    await updatePredictionPoints(
      prediction.id,
      points
    );

    await savePredictionHistory(
       prediction,
       points
    );
  }
}