import GameCard from "./GameCard";
import { games } from "../lib/games";

export default function GameList() {
  return (
    <div className="space-y-6">

      {games.map((game) => (

        <GameCard
          key={game.id}
          id={game.id}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          homeLogo={game.homeLogo}
          awayLogo={game.awayLogo}
          date={game.date}
          round={game.round}
          time={game.time}
        />

      ))}

    </div>
  );
}