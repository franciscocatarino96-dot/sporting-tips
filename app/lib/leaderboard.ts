import { getAllPredictions } from "./predictions";
import { users } from "./users";

export async function getLeaderboard() {
  const predictions = await getAllPredictions();

  const table = users.map((user) => {
    const totalPoints = predictions
      .filter((p) => p.userCode === user.code)
      .reduce((sum, p) => sum + (p.points ?? 0), 0);

    return {
      code: user.code,
      name: user.name,
      admin: user.admin,
      points: totalPoints,
    };
  });

  table.sort((a, b) => b.points - a.points);

  return table.map((player, index) => ({
    ...player,
    position: index + 1,
  }));
}