"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getResult } from "../lib/results";

import {
  getPrediction,
  getPredictionsByGame,
  arePredictionsClosed,
} from "../lib/predictions";

import { getCurrentUser } from "../lib/auth";

import { isPredictionOpen } from "../lib/gameStatus";

import { users } from "../lib/users";

import { getGameSchedule } from "../lib/gameSchedule";

type GameCardProps = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  date: string;
  time: string;
  round: string;
};

function formatDate(date: string) {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const d = new Date(
    `${date}T12:00:00`
  );

  return `${String(d.getDate()).padStart(
    2,
    "0"
  )} ${months[d.getMonth()]}`;
}

// =====================================================
// CONVERTER HORA DE LISBOA PARA HORA LOCAL
// =====================================================

function formatLocalTime(
  date: string,
  time: string
) {
  const [year, month, day] =
    date.split("-").map(Number);

  const [hour, minute] =
    time.split(":").map(Number);

  const reference = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute
    )
  );

  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Europe/Lisbon",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }
    );

  const parts =
    formatter.formatToParts(
      reference
    );

  const values: Record<
    string,
    number
  > = {};

  for (const part of parts) {
    if (
      part.type !== "literal" &&
      part.type !== "timeZoneName"
    ) {
      values[part.type] = Number(
        part.value
      );
    }
  }

  const lisbonAsUTC =
    Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second
    );

  const offset =
    lisbonAsUTC -
    reference.getTime();

  const kickoffTimestamp =
    reference.getTime() -
    offset;

  const localDate = new Date(
    kickoffTimestamp
  );

  return localDate.toLocaleTimeString(
    "pt-PT",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
}

function shortName(team: string) {
  switch (team) {
    case "Sporting CP":
      return "Sporting";

    case "Vitória SC":
      return "Vitória";

    case "FC Alverca":
      return "Alverca";

    case "Casa Pia AC":
      return "Casa Pia";

    case "FC Famalicão":
      return "Famalicão";

    case "SC Braga":
      return "Braga";

    case "FC Porto":
      return "Porto";

    case "Estoril Praia":
      return "Estoril";

    case "Est. Amadora":
      return "Estrela";

    default:
      return team;
  }
}

export default function GameCard({
  id,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  date,
  time,
  round,
}: GameCardProps) {
  const [result, setResult] =
    useState<{
      homeGoals: number;
      awayGoals: number;
    } | null>(null);

  const [hasPrediction, setHasPrediction] =
    useState(false);

  const [
    predictionsClosed,
    setPredictionsClosed,
  ] = useState(false);

  const [
    predictionCount,
    setPredictionCount,
  ] = useState(0);

  // =====================================================
  // HORÁRIO REAL DO JOGO
  // =====================================================

  const [gameDate, setGameDate] =
    useState(date);

  const [gameTime, setGameTime] =
    useState(time);

  useEffect(() => {
    async function loadGameData() {
      try {
        // -------------------------------------------------
        // HORÁRIO PERSONALIZADO
        // -------------------------------------------------

        const customSchedule =
          await getGameSchedule(id);

        const currentDate =
          customSchedule?.date ?? date;

        const currentTime =
          customSchedule?.time ?? time;

        setGameDate(currentDate);
        setGameTime(currentTime);

        // -------------------------------------------------
        // RESULTADO
        // -------------------------------------------------

        const resultData =
          await getResult(id);

        if (resultData) {
          setResult({
            homeGoals:
              resultData.homeGoals,
            awayGoals:
              resultData.awayGoals,
          });
        }

        // -------------------------------------------------
        // UTILIZADOR
        // -------------------------------------------------

        const user =
          getCurrentUser();

        if (user) {
          const prediction =
            await getPrediction(
              user.code,
              id
            );

          setHasPrediction(
            !!prediction
          );
        }

        // -------------------------------------------------
        // PALPITES
        // -------------------------------------------------

        const predictions =
          await getPredictionsByGame(
            id
          );

        setPredictionCount(
          predictions.length
        );

        // -------------------------------------------------
        // PALPITES FECHADOS
        // -------------------------------------------------

        const closed =
          await arePredictionsClosed(
            id
          );

        setPredictionsClosed(
          closed
        );

      } catch (error) {
        console.error(
          "Erro ao carregar jogo:",
          error
        );
      }
    }

    loadGameData();
  }, [id, date, time]);

  // =====================================================
  // PALPITES ABERTOS
  // =====================================================

  const predictionOpen =
    isPredictionOpen(
      gameDate,
      gameTime
    ) &&
    !predictionsClosed;

  // =====================================================
  // HORA LOCAL
  // =====================================================

  const localTime =
    formatLocalTime(
      gameDate,
      gameTime
    );

  return (
    <div>

      {/* CABEÇALHO */}

      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2 text-[11px] text-zinc-500">

        <p className="font-semibold">
          {round}
        </p>

        <p>
          {formatDate(gameDate)} •{" "}
          {localTime}
        </p>

      </div>

      {/* JOGO */}

      <div className="px-4 py-4">

        <div className="grid grid-cols-3 items-center">

          {/* CASA */}

          <div className="flex flex-col items-center">

            <Image
              src={homeLogo}
              alt={homeTeam}
              width={36}
              height={36}
            />

            <p className="mt-2 text-center text-sm font-semibold leading-tight">
              {shortName(homeTeam)}
            </p>

          </div>

          {/* RESULTADO */}

          <div className="text-center">

            <p className="text-2xl font-black">

              {result
                ? `${result.homeGoals} - ${result.awayGoals}`
                : "VS"}

            </p>

          </div>

          {/* FORA */}

          <div className="flex flex-col items-center">

            <Image
              src={awayLogo}
              alt={awayTeam}
              width={36}
              height={36}
            />

            <p className="mt-2 text-center text-sm font-semibold leading-tight">
              {shortName(awayTeam)}
            </p>

          </div>

        </div>

        {/* BOTÃO */}

        <Link href={`/game/${id}`}>

          {result ? (

            <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 py-2 text-sm font-semibold text-white shadow-inner transition hover:from-zinc-500 hover:via-zinc-400 hover:to-zinc-500">

              ✅ Ver Pontuações

            </button>

          ) : predictionOpen ? (

            <button
              className={
                hasPrediction
                  ? "mt-4 w-full rounded-lg bg-yellow-300 py-2 text-sm font-semibold text-black transition hover:bg-yellow-200"
                  : "mt-4 w-full rounded-lg bg-[#0B5E3C] py-2 text-sm font-semibold text-white transition hover:bg-[#0F7148]"
              }
            >

              {hasPrediction
                ? "✏️ Editar Palpite"
                : "📝 Dar Palpite"}

            </button>

          ) : (

            <button className="mt-4 w-full rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-red-400 transition hover:bg-zinc-700">

              🔒 Ver Palpites

            </button>

          )}

        </Link>

        {/* CONTADOR */}

        <p className="mt-2 text-center text-sm font-semibold text-zinc-500">
          {predictionCount} de{" "}
          {users.length} palpites
        </p>

      </div>

    </div>
  );
}