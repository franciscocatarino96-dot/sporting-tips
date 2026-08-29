import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Competition } from "./types";

export type GameSchedule = {
  gameId: number;
  competition: Competition;
  date: string;
  time: string;
};

function getScheduleId(
  gameId: number,
  competition: Competition
) {
  if (competition === "liga") {
    return `${gameId}`;
  }

  return `champions_${gameId}`;
}

export async function getGameSchedule(
  gameId: number,
  competition: Competition = "liga"
): Promise<GameSchedule | null> {
  const scheduleId =
    getScheduleId(
      gameId,
      competition
    );

  const snapshot = await getDoc(
    doc(
      db,
      "gameSettings",
      scheduleId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as GameSchedule;
}

export async function saveGameSchedule(
  gameId: number,
  date: string,
  time: string,
  competition: Competition = "liga"
) {
  const scheduleId =
    getScheduleId(
      gameId,
      competition
    );

  await setDoc(
    doc(
      db,
      "gameSettings",
      scheduleId
    ),
    {
      gameId,
      competition,
      date,
      time,
      updatedAt:
        new Date().toISOString(),
    },
    {
      merge: true,
    }
  );
}