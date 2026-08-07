type Prediction = {
  homeGoals: number;
  awayGoals: number;
};

type Result = {
  homeGoals: number;
  awayGoals: number;
};

export function calculatePoints(
  prediction: Prediction,
  result: Result,
  sportingHome: boolean
) {
  // 🎯 Resultado exato
  if (
    prediction.homeGoals === result.homeGoals &&
    prediction.awayGoals === result.awayGoals
  ) {
    return 7;
  }

  let points = 0;

  // ✅ Tendência
  const predictionWinner =
    prediction.homeGoals > prediction.awayGoals
      ? "HOME"
      : prediction.homeGoals < prediction.awayGoals
      ? "AWAY"
      : "DRAW";

  const resultWinner =
    result.homeGoals > result.awayGoals
      ? "HOME"
      : result.homeGoals < result.awayGoals
      ? "AWAY"
      : "DRAW";

  if (predictionWinner === resultWinner) {
    points += 3;
  }

  // ⚽🥅 Golos do Sporting
  if (sportingHome) {
    // Sporting joga em casa

    if (prediction.homeGoals === result.homeGoals) {
      points += 1;
    }

    if (prediction.awayGoals === result.awayGoals) {
      points += 1;
    }
  } else {
    // Sporting joga fora

    if (prediction.awayGoals === result.awayGoals) {
      points += 1;
    }

    if (prediction.homeGoals === result.homeGoals) {
      points += 1;
    }
  }

  return points;
}