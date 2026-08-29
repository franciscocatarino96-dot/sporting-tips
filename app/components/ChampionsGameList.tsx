"use client";

import GameCard from "./GameCard";
import { championsGames } from "../lib/championsGames";

export default function ChampionsGameList() {
  return (
    <div className="space-y-6">

      {championsGames.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          homeLogo={game.homeLogo}
          awayLogo={game.awayLogo}
          date={game.date}
          time={game.time}
          round={game.round}
          competition="champions"
        />
      ))}

    </div>
  );
}