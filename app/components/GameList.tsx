"use client";

import { useEffect, useState } from "react";

import GameCard from "./GameCard";
import { games } from "../lib/games";
import { getGameSchedule } from "../lib/gameSchedule";

type GameSchedule = {
  gameId: number;
  date: string;
  time: string;
};

export default function GameList() {
  const [schedules, setSchedules] = useState<
    Record<number, GameSchedule>
  >({});

  useEffect(() => {
    async function loadSchedules() {
      try {
        const results = await Promise.all(
          games.map((game) =>
            getGameSchedule(game.id)
          )
        );

        const scheduleMap: Record<
          number,
          GameSchedule
        > = {};

        results.forEach((schedule, index) => {
          if (schedule) {
            scheduleMap[games[index].id] =
              schedule;
          }
        });

        setSchedules(scheduleMap);
      } catch (error) {
        console.error(
          "Erro ao carregar horários dos jogos:",
          error
        );
      }
    }

    loadSchedules();
  }, []);

  return (
    <div className="space-y-6">

      {games.map((game) => {
        const customSchedule =
          schedules[game.id];

        const date =
          customSchedule?.date ??
          game.date;

        const time =
          customSchedule?.time ??
          game.time;

        return (
          <GameCard
            key={game.id}
            id={game.id}
            homeTeam={game.homeTeam}
            awayTeam={game.awayTeam}
            homeLogo={game.homeLogo}
            awayLogo={game.awayLogo}
            date={date}
            round={game.round}
            time={time}
          />
        );
      })}

    </div>
  );
}