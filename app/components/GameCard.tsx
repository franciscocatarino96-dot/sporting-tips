"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getResult } from "../lib/results";
import { isPredictionOpen } from "../lib/gameStatus";

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

  const d = new Date(date);

  return `${String(d.getDate()).padStart(2, "0")} ${
    months[d.getMonth()]
  }`;
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
  const [result, setResult] = useState<{
    homeGoals: number;
    awayGoals: number;
  } | null>(null);

  useEffect(() => {
    async function loadResult() {
      const data = await getResult(id);

      if (data) {
        setResult({
          homeGoals: data.homeGoals,
          awayGoals: data.awayGoals,
        });
      }
    }

    loadResult();
  }, [id]);

  const predictionOpen = isPredictionOpen(date, time);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 transition-all duration-300 hover:border-green-700">

      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2 text-[11px] text-zinc-500">
        <p className="font-semibold">{round}</p>

        <p>
          {formatDate(date)} • {time}
        </p>
      </div>

      <div className="px-4 py-4">

        <div className="grid grid-cols-3 items-center">

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

          <div className="text-center">

            <p className="text-2xl font-black">

              {result
                ? `${result.homeGoals} - ${result.awayGoals}`
                : "VS"}

            </p>

          </div>

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

        <Link href={`/game/${id}`}>

          {result ? (

            <button className="mt-4 w-full rounded-lg bg-[#0B5E3C] py-2 text-sm font-semibold text-white transition hover:bg-[#0F7148]">

              ✅ Ver Resultado

            </button>

          ) : predictionOpen ? (

            <button className="mt-4 w-full rounded-lg bg-[#0B5E3C] py-2 text-sm font-semibold text-white transition hover:bg-[#0F7148]">

              Dar Palpite

            </button>

          ) : (

            <button className="mt-4 w-full rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-red-400 transition hover:bg-zinc-700">

              🔒 Ver Palpites

            </button>

          )}

        </Link>

      </div>

    </div>
  );
}