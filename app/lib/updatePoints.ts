import { getResult } from "./results";

import {
  getPredictionsByGame,
  updatePredictionPoints,
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

  for (const prediction of predictions) {
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
  }
}