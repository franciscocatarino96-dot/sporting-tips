const MINUTES_BEFORE_KICKOFF = 5;

const LISBON_TIME_ZONE = "Europe/Lisbon";

function getKickoffTimestamp(
  date: string,
  time: string
): number {
  // Criamos uma data que representa a hora indicada
  // em Lisboa e convertemos para um timestamp real.

  const [year, month, day] = date
    .split("-")
    .map(Number);

  const [hour, minute] = time
    .split(":")
    .map(Number);

  // Encontrar o offset de Lisboa para essa data.
  const reference = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute
    )
  );

  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: LISBON_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }
  );

  const parts = formatter.formatToParts(reference);

  const values: Record<string, number> = {};

  for (const part of parts) {
    if (
      part.type !== "literal" &&
      part.type !== "timeZoneName"
    ) {
      values[part.type] = Number(part.value);
    }
  }

  const lisbonAsUTC = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second
  );

  const offset =
    lisbonAsUTC - reference.getTime();

  return reference.getTime() - offset;
}

// =====================================================
// PALPITES ABERTOS?
// =====================================================

export function isPredictionOpen(
  date: string,
  time: string
) {
  const kickoff = getKickoffTimestamp(
    date,
    time
  );

  const now = Date.now();

  const diffMinutes =
    (kickoff - now) / (1000 * 60);

  return (
    diffMinutes >= MINUTES_BEFORE_KICKOFF
  );
}

// =====================================================
// JOGO JÁ COMEÇOU?
// =====================================================

export function hasGameStarted(
  date: string,
  time: string
) {
  const kickoff = getKickoffTimestamp(
    date,
    time
  );

  return Date.now() >= kickoff;
}

// =====================================================
// MINUTOS ATÉ AO JOGO
// =====================================================

export function minutesUntilKickoff(
  date: string,
  time: string
) {
  const kickoff = getKickoffTimestamp(
    date,
    time
  );

  return Math.floor(
    (kickoff - Date.now()) /
      (1000 * 60)
  );
}