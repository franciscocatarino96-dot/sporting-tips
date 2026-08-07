import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function saveResult(
  gameId: number,
  homeGoals: number,
  awayGoals: number
) {
  await setDoc(doc(db, "results", `${gameId}`), {
    gameId,
    homeGoals,
    awayGoals,
    finished: true,
  });
}

export async function getResult(gameId: number) {
  const snapshot = await getDoc(
    doc(db, "results", `${gameId}`)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function resetResult(gameId: number) {
  await deleteDoc(
    doc(db, "results", `${gameId}`)
  );
}