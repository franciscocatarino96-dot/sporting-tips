import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";
import { Prediction } from "./types";
import { games } from "./games";
import { isPredictionOpen } from "./gameStatus";
import { getResult } from "./results";

export async function savePrediction(
  userCode: string,
  userName: string,
  gameId: number,
  round: number,
  homeGoals: number,
  awayGoals: number
) {
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    throw new Error("Jogo não encontrado.");
  }

  if (!isPredictionOpen(game.date, game.time)) {
    throw new Error("Os palpites para este jogo já encerraram.");
  }

  const predictionId = `${userCode}_${gameId}`;

  await setDoc(doc(db, "predictions", predictionId), {
    userCode,
    userName,
    gameId,
    round,
    homeGoals,
    awayGoals,
    points: 0,
    createdAt: new Date().toISOString(),
  });
}

export async function getPrediction(
  userCode: string,
  gameId: number
): Promise<Prediction | null> {
  const snapshot = await getDoc(
    doc(db, "predictions", `${userCode}_${gameId}`)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Prediction, "id">),
  };
}

export async function getMyPredictions(
  userCode: string
): Promise<any[]> {
  const q = query(
    collection(db, "predictions"),
    where("userCode", "==", userCode)
  );

  const snapshot = await getDocs(q);

  return Promise.all(
    snapshot.docs.map(async (doc) => {
      const prediction = {
        id: doc.id,
        ...(doc.data() as Omit<Prediction, "id">),
      };

      const game = games.find(
        (g) => g.id === prediction.gameId
      );

      const result = await getResult(prediction.gameId);

      return {
        ...prediction,
        game,
        result,
      };
    })
  );
}

export async function getPredictionsByGame(
  gameId: number
): Promise<Prediction[]> {
  const q = query(
    collection(db, "predictions"),
    where("gameId", "==", gameId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Prediction, "id">),
  }));
}

export async function updatePredictionPoints(
  predictionId: string,
  points: number
) {
  await updateDoc(
    doc(db, "predictions", predictionId),
    {
      points,
    }
  );
}

export async function getAllPredictions(): Promise<Prediction[]> {
  const snapshot = await getDocs(
    collection(db, "predictions")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Prediction, "id">),
  }));
}

export async function resetPredictionPoints(
  gameId: number
) {
  const q = query(
    collection(db, "predictions"),
    where("gameId", "==", gameId)
  );

  const snapshot = await getDocs(q);

  const batch = writeBatch(db);

  snapshot.docs.forEach((docSnapshot) => {
    batch.update(docSnapshot.ref, {
      points: 0,
    });
  });

  await batch.commit();
}

export async function deletePrediction(
  predictionId: string
) {
  await deleteDoc(
    doc(db, "predictions", predictionId)
  );
}