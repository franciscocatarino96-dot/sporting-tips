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

// =====================================================
// VERIFICAR SE OS PALPITES ESTÃO FECHADOS
// =====================================================

export async function arePredictionsClosed(
  gameId: number
): Promise<boolean> {
  const snapshot = await getDoc(
    doc(db, "closedPredictions", `${gameId}`)
  );

  return snapshot.exists();
}

// =====================================================
// FECHAR PALPITES
// =====================================================

export async function closePredictions(
  gameId: number
) {
  await setDoc(
    doc(db, "closedPredictions", `${gameId}`),
    {
      gameId,
      closed: true,
      closedAt: new Date().toISOString(),
    }
  );
}

// =====================================================
// ABRIR PALPITES
// =====================================================

export async function openPredictions(
  gameId: number
) {
  await deleteDoc(
    doc(db, "closedPredictions", `${gameId}`)
  );
}

// =====================================================
// GUARDAR PALPITE
// =====================================================

export async function savePrediction(
  userCode: string,
  userName: string,
  gameId: number,
  homeGoals: number,
  awayGoals: number
) {
  const game = games.find(
    (g) => g.id === gameId
  );

  if (!game) {
    throw new Error("Jogo não encontrado.");
  }

  const closed = await arePredictionsClosed(
    gameId
  );

  if (closed) {
    throw new Error(
      "Os palpites para este jogo estão encerrados."
    );
  }

  if (!isPredictionOpen(game.date, game.time)) {
    throw new Error(
      "Os palpites para este jogo já encerraram."
    );
  }

  const predictionId = `${userCode}_${gameId}`;

  await setDoc(
    doc(db, "predictions", predictionId),
    {
      userCode,
      userName,
      gameId,
      round: game.round,
      homeGoals,
      awayGoals,
      points: 0,
      createdAt: new Date().toISOString(),
    }
  );
}

// =====================================================
// OBTER UM PALPITE
// =====================================================

export async function getPrediction(
  userCode: string,
  gameId: number
): Promise<Prediction | null> {
  const snapshot = await getDoc(
    doc(
      db,
      "predictions",
      `${userCode}_${gameId}`
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<
      Prediction,
      "id"
    >),
  };
}

// =====================================================
// OBTER OS MEUS PALPITES
// =====================================================

export async function getMyPredictions(
  userCode: string
): Promise<any[]> {
  const q = query(
    collection(db, "predictions"),
    where("userCode", "==", userCode)
  );

  const snapshot = await getDocs(q);

  return Promise.all(
    snapshot.docs.map(async (docSnapshot) => {
      const prediction = {
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<
          Prediction,
          "id"
        >),
      };

      const game = games.find(
        (g) => g.id === prediction.gameId
      );

      const result = await getResult(
        prediction.gameId
      );

      const closed = await arePredictionsClosed(
        prediction.gameId
      );

      return {
        ...prediction,
        game,
        result,
        predictionsOpen: !closed,
      };
    })
  );
}

// =====================================================
// OBTER PALPITES DE UM JOGO
// =====================================================

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
    ...(doc.data() as Omit<
      Prediction,
      "id"
    >),
  }));
}

// =====================================================
// ATUALIZAR PONTOS
// =====================================================

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

// =====================================================
// OBTER TODOS OS PALPITES
// =====================================================

export async function getAllPredictions(): Promise<
  Prediction[]
> {
  const snapshot = await getDocs(
    collection(db, "predictions")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<
      Prediction,
      "id"
    >),
  }));
}

// =====================================================
// REPOR PONTOS DE UM JOGO
// =====================================================

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

// =====================================================
// APAGAR PALPITE
// =====================================================

export async function deletePrediction(
  predictionId: string,
  gameId: number
) {
  const closed = await arePredictionsClosed(
    gameId
  );

  if (closed) {
    throw new Error(
      "Não é possível apagar o palpite. Os palpites estão encerrados."
    );
  }

  await deleteDoc(
    doc(db, "predictions", predictionId)
  );
}

// =====================================================
// GUARDAR PALPITE NO HISTÓRICO
// =====================================================

export async function savePredictionHistory(
  prediction: Prediction,
  points: number
) {
  const historyId = `${prediction.userCode}_${prediction.gameId}`;

  await setDoc(
    doc(
      db,
      "predictionHistory",
      historyId
    ),
    {
      userCode: prediction.userCode,
      userName: prediction.userName,
      gameId: prediction.gameId,
      round: prediction.round,
      homeGoals: prediction.homeGoals,
      awayGoals: prediction.awayGoals,
      points,
      savedAt: new Date().toISOString(),
    }
  );
}

// =====================================================
// OBTER HISTÓRICO DE PALPITES
// =====================================================

export async function getPredictionHistory(
  userCode: string
): Promise<any[]> {
  const q = query(
    collection(db, "predictionHistory"),
    where("userCode", "==", userCode)
  );

  const snapshot = await getDocs(q);

  const allHistory = snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...(docSnapshot.data() as {
      userCode: string;
      userName: string;
      gameId: number;
      round: string;
      homeGoals: number;
      awayGoals: number;
      points: number;
      savedAt: string;
    }),
  }));

  // Se existirem vários registos antigos da mesma jornada,
  // ficamos apenas com o mais recente.
  const latestByGame = new Map<number, any>();

  for (const item of allHistory) {
    const existing = latestByGame.get(item.gameId);

    if (
      !existing ||
      item.savedAt > existing.savedAt
    ) {
      latestByGame.set(
        item.gameId,
        item
      );
    }
  }

  return Array.from(
    latestByGame.values()
  ).sort(
    (a, b) => a.gameId - b.gameId
  );
}

// =====================================================
// APAGAR HISTÓRICO DE UM JOGO
// =====================================================

export async function resetPredictionHistory(
  gameId: number
) {
  const q = query(
    collection(db, "predictionHistory"),
    where("gameId", "==", gameId)
  );

  const snapshot = await getDocs(q);

  const batch = writeBatch(db);

  snapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  await batch.commit();
}