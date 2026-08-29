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

import {
  Prediction,
  Competition,
} from "./types";

import { games } from "./games";
import { championsGames } from "./championsGames";

import { isPredictionOpen } from "./gameStatus";

import { getResult } from "./results";


// =====================================================
// ID DO PALPITE
// =====================================================

function getPredictionId(
  userCode: string,
  gameId: number,
  competition: Competition
) {
  if (competition === "liga") {
    return `${userCode}_${gameId}`;
  }

  return `champions_${userCode}_${gameId}`;
}


// =====================================================
// OBTER JOGO
// =====================================================

function getGame(
  gameId: number,
  competition: Competition
) {
  if (competition === "liga") {
    return games.find(
      (game) => game.id === gameId
    );
  }

  return championsGames.find(
    (game) => game.id === gameId
  );
}


// =====================================================
// VERIFICAR SE OS PALPITES ESTÃO FECHADOS
// =====================================================

export async function arePredictionsClosed(
  gameId: number,
  competition: Competition = "liga"
): Promise<boolean> {

  const closedId =
    competition === "liga"
      ? `${gameId}`
      : `champions_${gameId}`;

  const snapshot = await getDoc(
    doc(
      db,
      "closedPredictions",
      closedId
    )
  );

  return snapshot.exists();
}


// =====================================================
// FECHAR PALPITES
// =====================================================

export async function closePredictions(
  gameId: number,
  competition: Competition = "liga"
) {

  const closedId =
    competition === "liga"
      ? `${gameId}`
      : `champions_${gameId}`;

  await setDoc(
    doc(
      db,
      "closedPredictions",
      closedId
    ),
    {
      gameId,
      competition,
      closed: true,
      closedAt:
        new Date().toISOString(),
    }
  );
}


// =====================================================
// ABRIR PALPITES
// =====================================================

export async function openPredictions(
  gameId: number,
  competition: Competition = "liga"
) {

  const closedId =
    competition === "liga"
      ? `${gameId}`
      : `champions_${gameId}`;

  await deleteDoc(
    doc(
      db,
      "closedPredictions",
      closedId
    )
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
  awayGoals: number,
  competition: Competition = "liga"
) {

  const game = getGame(
    gameId,
    competition
  );

  if (!game) {
    throw new Error(
      "Jogo não encontrado."
    );
  }

  // ---------------------------------------------------
  // VERIFICAR SE ESTÁ FECHADO MANUALMENTE
  // ---------------------------------------------------

  const closed =
    await arePredictionsClosed(
      gameId,
      competition
    );

  if (closed) {
    throw new Error(
      "Os palpites para este jogo estão encerrados."
    );
  }

  // ---------------------------------------------------
  // VERIFICAR HORÁRIO
  // ---------------------------------------------------

  if (
    !isPredictionOpen(
      game.date,
      game.time
    )
  ) {
    throw new Error(
      "Os palpites para este jogo já encerraram."
    );
  }

  // ---------------------------------------------------
  // ID
  // ---------------------------------------------------

  const predictionId =
    getPredictionId(
      userCode,
      gameId,
      competition
    );

  // ---------------------------------------------------
  // GUARDAR
  // ---------------------------------------------------

  await setDoc(
    doc(
      db,
      "predictions",
      predictionId
    ),
    {
      userCode,
      userName,
      gameId,
      round: game.round,
      homeGoals,
      awayGoals,
      points: 0,
      competition,
      createdAt:
        new Date().toISOString(),
    }
  );
}


// =====================================================
// OBTER UM PALPITE
// =====================================================

export async function getPrediction(
  userCode: string,
  gameId: number,
  competition: Competition = "liga"
): Promise<Prediction | null> {

  const predictionId =
    getPredictionId(
      userCode,
      gameId,
      competition
    );

  const snapshot = await getDoc(
    doc(
      db,
      "predictions",
      predictionId
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
  userCode: string,
  competition: Competition = "liga"
): Promise<any[]> {

  const q = query(
    collection(db, "predictions"),
    where(
      "userCode",
      "==",
      userCode
    )
  );

  const snapshot =
    await getDocs(q);

  const filteredDocs =
    snapshot.docs.filter(
      (docSnapshot) => {

        const data =
          docSnapshot.data();

        // ------------------------------------------------
        // COMPATIBILIDADE COM PALPITES ANTIGOS DA LIGA
        // ------------------------------------------------

        if (
          competition === "liga" &&
          !data.competition
        ) {
          return true;
        }

        return (
          data.competition ===
          competition
        );
      }
    );

  return Promise.all(
    filteredDocs.map(
      async (docSnapshot) => {

        const prediction = {
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<
            Prediction,
            "id"
          >),
        };

        const game =
          getGame(
            prediction.gameId,
            competition
          );

        const result =
          await getResult(
            prediction.gameId,
            competition
          );

        const closed =
          await arePredictionsClosed(
            prediction.gameId,
            competition
          );

        return {
          ...prediction,
          game,
          result,
          predictionsOpen:
            !closed,
        };
      }
    )
  );
}


// =====================================================
// OBTER PALPITES DE UM JOGO
// =====================================================

export async function getPredictionsByGame(
  gameId: number,
  competition: Competition = "liga"
): Promise<Prediction[]> {

  const q = query(
    collection(db, "predictions"),
    where(
      "gameId",
      "==",
      gameId
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs
    .filter(
      (docSnapshot) => {

        const data =
          docSnapshot.data();

        // ------------------------------------------------
        // PALPITES ANTIGOS DA LIGA
        // ------------------------------------------------

        if (
          competition === "liga" &&
          !data.competition
        ) {
          return true;
        }

        return (
          data.competition ===
          competition
        );
      }
    )
    .map(
      (docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<
          Prediction,
          "id"
        >),
      })
    );
}


// =====================================================
// ATUALIZAR PONTOS
// =====================================================

export async function updatePredictionPoints(
  predictionId: string,
  points: number
) {

  await updateDoc(
    doc(
      db,
      "predictions",
      predictionId
    ),
    {
      points,
    }
  );
}


// =====================================================
// OBTER TODOS OS PALPITES
// =====================================================

export async function getAllPredictions(
  competition: Competition = "liga"
): Promise<Prediction[]> {

  const snapshot =
    await getDocs(
      collection(
        db,
        "predictions"
      )
    );

  return snapshot.docs
    .filter(
      (docSnapshot) => {

        const data =
          docSnapshot.data();

        // ------------------------------------------------
        // DADOS ANTIGOS = LIGA
        // ------------------------------------------------

        if (
          competition === "liga" &&
          !data.competition
        ) {
          return true;
        }

        return (
          data.competition ===
          competition
        );
      }
    )
    .map(
      (docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<
          Prediction,
          "id"
        >),
      })
    );
}


// =====================================================
// REPOR PONTOS DE UM JOGO
// =====================================================

export async function resetPredictionPoints(
  gameId: number,
  competition: Competition = "liga"
) {

  const q = query(
    collection(
      db,
      "predictions"
    ),
    where(
      "gameId",
      "==",
      gameId
    )
  );

  const snapshot =
    await getDocs(q);

  const batch =
    writeBatch(db);

  snapshot.docs
    .filter(
      (docSnapshot) => {

        const data =
          docSnapshot.data();

        if (
          competition === "liga" &&
          !data.competition
        ) {
          return true;
        }

        return (
          data.competition ===
          competition
        );
      }
    )
    .forEach(
      (docSnapshot) => {

        batch.update(
          docSnapshot.ref,
          {
            points: 0,
          }
        );
      }
    );

  await batch.commit();
}


// =====================================================
// APAGAR PALPITE
// =====================================================

export async function deletePrediction(
  predictionId: string,
  gameId: number,
  competition: Competition = "liga"
) {

  const closed =
    await arePredictionsClosed(
      gameId,
      competition
    );

  if (closed) {
    throw new Error(
      "Não é possível apagar o palpite. Os palpites estão encerrados."
    );
  }

  await deleteDoc(
    doc(
      db,
      "predictions",
      predictionId
    )
  );
}


// =====================================================
// GUARDAR PALPITE NO HISTÓRICO
// =====================================================

export async function savePredictionHistory(
  prediction: Prediction,
  points: number,
  competition: Competition = "liga"
) {

  const historyId =
    competition === "liga"
      ? `${prediction.userCode}_${prediction.gameId}`
      : `champions_${prediction.userCode}_${prediction.gameId}`;

  await setDoc(
    doc(
      db,
      "predictionHistory",
      historyId
    ),
    {
      userCode:
        prediction.userCode,

      userName:
        prediction.userName,

      gameId:
        prediction.gameId,

      round:
        prediction.round,

      homeGoals:
        prediction.homeGoals,

      awayGoals:
        prediction.awayGoals,

      points,

      competition,

      savedAt:
        new Date().toISOString(),
    }
  );
}


// =====================================================
// OBTER HISTÓRICO DE PALPITES
// =====================================================

export async function getPredictionHistory(
  userCode: string,
  competition: Competition = "liga"
): Promise<any[]> {

  const q = query(
    collection(
      db,
      "predictionHistory"
    ),
    where(
      "userCode",
      "==",
      userCode
    )
  );

  const snapshot =
    await getDocs(q);

  const allHistory =
    snapshot.docs
      .filter(
        (docSnapshot) => {

          const data =
            docSnapshot.data();

          // ------------------------------------------------
          // HISTÓRICO ANTIGO = LIGA
          // ------------------------------------------------

          if (
            competition === "liga" &&
            !data.competition
          ) {
            return true;
          }

          return (
            data.competition ===
            competition
          );
        }
      )
      .map(
        (docSnapshot) => ({
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
            competition?: Competition;
          }),
        })
      );

  // =====================================================
  // FICAR COM O MAIS RECENTE
  // =====================================================

  const latestByGame =
    new Map<number, any>();

  for (const item of allHistory) {

    const existing =
      latestByGame.get(
        item.gameId
      );

    if (
      !existing ||
      item.savedAt >
        existing.savedAt
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
    (a, b) =>
      a.gameId -
      b.gameId
  );
}


// =====================================================
// APAGAR HISTÓRICO DE UM JOGO
// =====================================================

export async function resetPredictionHistory(
  gameId: number,
  competition: Competition = "liga"
) {

  const q = query(
    collection(
      db,
      "predictionHistory"
    ),
    where(
      "gameId",
      "==",
      gameId
    )
  );

  const snapshot =
    await getDocs(q);

  const batch =
    writeBatch(db);

  snapshot.docs
    .filter(
      (docSnapshot) => {

        const data =
          docSnapshot.data();

        if (
          competition === "liga" &&
          !data.competition
        ) {
          return true;
        }

        return (
          data.competition ===
          competition
        );
      }
    )
    .forEach(
      (docSnapshot) => {

        batch.delete(
          docSnapshot.ref
        );
      }
    );

  await batch.commit();
}