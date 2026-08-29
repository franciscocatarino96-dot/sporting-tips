import { getAllPredictions } from "./predictions";
import { getResult } from "./results";
import { users } from "./users";
import { games } from "./games";
import { championsGames } from "./championsGames";
import { Competition } from "./types";

export async function getLeaderboard(
  competition: Competition = "liga"
) {
  const predictions =
    await getAllPredictions(
      competition
    );

  // =====================================================
  // ESCOLHER OS JOGOS DA COMPETIÇÃO
  // =====================================================

  const competitionGames =
    competition === "liga"
      ? games
      : championsGames;

  // =====================================================
  // OBTER APENAS OS JOGOS QUE JÁ TÊM RESULTADO
  // =====================================================

  const completedGameIds =
    new Set<number>();

  await Promise.all(
    competitionGames.map(
      async (game) => {
        const result =
          await getResult(
            game.id,
            competition
          );

        if (result) {
          completedGameIds.add(
            game.id
          );
        }
      }
    )
  );

  // =====================================================
  // CLASSIFICAÇÃO
  // =====================================================

  const table = users.map(
    (user) => {
      const totalPoints =
        predictions
          .filter(
            (prediction) =>
              prediction.userCode ===
                user.code &&
              completedGameIds.has(
                prediction.gameId
              )
          )
          .reduce(
            (
              sum,
              prediction
            ) =>
              sum +
              (prediction.points ??
                0),
            0
          );

      return {
        code: user.code,
        name: user.name,
        admin: user.admin,
        points: totalPoints,
      };
    }
  );

  // =====================================================
  // ORDENAR
  // =====================================================

  table.sort((a, b) => {
    if (
      b.points !==
      a.points
    ) {
      return (
        b.points -
        a.points
      );
    }

    return a.name.localeCompare(
      b.name
    );
  });

  // =====================================================
  // POSIÇÕES
  // =====================================================

  return table.map(
    (player, index) => ({
      ...player,
      position:
        index + 1,
    })
  );
}