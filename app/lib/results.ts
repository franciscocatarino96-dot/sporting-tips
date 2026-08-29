import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { Competition } from "./types";

export async function saveResult(
  gameId: number,
  homeGoals: number,
  awayGoals: number,
  competition: Competition = "liga"
) {
  const resultId =
    competition === "liga"
      ? `${gameId}`
      : `champions_${gameId}`;

  await setDoc(
    doc(db, "results", resultId),
    {
      gameId,
      competition,
      homeGoals,
      awayGoals,
      finished: true,
    }
  );
}

export async function getResult(
  gameId: number,
  competition: Competition = "liga"
) {
  // =====================================================
  // LIGA
  // =====================================================
  //
  // Os resultados antigos da Liga têm apenas o gameId
  // como ID e não têm competition.
  //
  // Mantemos exatamente esses documentos.
  // =====================================================

  if (competition === "liga") {
    const snapshot = await getDoc(
      doc(db, "results", `${gameId}`)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  }

  // =====================================================
  // CHAMPIONS
  // =====================================================

  const snapshot = await getDoc(
    doc(
      db,
      "results",
      `champions_${gameId}`
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function resetResult(
  gameId: number,
  competition: Competition = "liga"
) {
  const resultId =
    competition === "liga"
      ? `${gameId}`
      : `champions_${gameId}`;

  await deleteDoc(
    doc(db, "results", resultId)
  );
}