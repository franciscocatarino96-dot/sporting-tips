import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type GameSchedule = {
  gameId: number;
  date: string;
  time: string;
};

export async function getGameSchedule(
  gameId: number
): Promise<GameSchedule | null> {
  const snapshot = await getDoc(
    doc(db, "gameSettings", `${gameId}`)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as GameSchedule;
}

export async function saveGameSchedule(
  gameId: number,
  date: string,
  time: string
) {
  await setDoc(
    doc(db, "gameSettings", `${gameId}`),
    {
      gameId,
      date,
      time,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}