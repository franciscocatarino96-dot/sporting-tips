const MINUTES_BEFORE_KICKOFF = 5;

export function isPredictionOpen(
  date: string,
  time: string
) {
  const kickoff = new Date(`${date}T${time}:00`);

  const now = new Date();

  const diffMinutes =
    (kickoff.getTime() - now.getTime()) / (1000 * 60);

  return diffMinutes >= MINUTES_BEFORE_KICKOFF;
}

export function hasGameStarted(
  date: string,
  time: string
) {
  const kickoff = new Date(`${date}T${time}:00`);

  return new Date() >= kickoff;
}

export function minutesUntilKickoff(
  date: string,
  time: string
) {
  const kickoff = new Date(`${date}T${time}:00`);

  return Math.floor(
    (kickoff.getTime() - new Date().getTime()) /
      (1000 * 60)
  );
}