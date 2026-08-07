import { getLeaderboard } from "./leaderboard";

export async function getUserStats(userCode: string) {
  const leaderboard = await getLeaderboard();

  const player = leaderboard.find(
    (p) => p.code === userCode
  );

  if (!player) {
    return {
      points: 0,
      position: "-",
    };
  }

  return {
    points: player.points,
    position: player.position,
  };
}