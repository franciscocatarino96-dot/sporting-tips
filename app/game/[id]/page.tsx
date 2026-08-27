import { games } from "@/app/lib/games";
import { getResult } from "@/app/lib/results";
import { isPredictionOpen } from "@/app/lib/gameStatus";
import { arePredictionsClosed } from "@/app/lib/predictions";
import { getGameSchedule } from "@/app/lib/gameSchedule";

import Image from "next/image";
import Link from "next/link";

import PredictionForm from "@/app/components/PredictionForm";
import PredictionsList from "@/app/components/PredictionsList";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GamePage({
  params,
}: Props) {
  const { id } = await params;

  const game = games.find(
    (g) => g.id === Number(id)
  );

  if (!game) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p>Jogo não encontrado.</p>
        </div>
      </main>
    );
  }

  // =====================================================
  // HORÁRIO PERSONALIZADO
  // =====================================================

  const customSchedule =
    await getGameSchedule(game.id);

  const gameDate =
    customSchedule?.date ?? game.date;

  const gameTime =
    customSchedule?.time ?? game.time;

  // =====================================================
  // RESULTADO
  // =====================================================

  const result = await getResult(game.id);

  // =====================================================
  // PALPITES FECHADOS MANUALMENTE
  // =====================================================

  const closed = await arePredictionsClosed(
    game.id
  );

  // =====================================================
  // PALPITES ABERTOS?
  //
  // gameStatus usa sempre a hora de Lisboa.
  // =====================================================

  const predictionOpen =
    isPredictionOpen(
      gameDate,
      gameTime
    ) && !closed;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <div className="mx-auto max-w-5xl px-4 py-6">

        <h1 className="mb-5 text-center text-2xl font-black">
          Dar Palpite
        </h1>

        <div className="rounded-2xl bg-zinc-800 p-4">

          <p className="mb-4 text-center text-xs text-zinc-400">
            {game.round} • {gameDate} • {gameTime}
          </p>

          <div className="grid grid-cols-3 items-center">

            {/* CASA */}

            <div className="flex flex-col items-center">

              <Image
                src={game.homeLogo}
                alt={game.homeTeam}
                width={55}
                height={55}
              />

              <p className="mt-2 text-center text-sm font-semibold">
                {game.homeTeam}
              </p>

            </div>

            {/* RESULTADO */}

            <div className="text-center">

              {result ? (
                <>
                  <p className="text-3xl font-black">
                    {result.homeGoals} -{" "}
                    {result.awayGoals}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-green-500">
                    Resultado Final
                  </p>
                </>
              ) : (
                <p className="text-2xl font-black text-zinc-500">
                  VS
                </p>
              )}

            </div>

            {/* FORA */}

            <div className="flex flex-col items-center">

              <Image
                src={game.awayLogo}
                alt={game.awayTeam}
                width={55}
                height={55}
              />

              <p className="mt-2 text-center text-sm font-semibold">
                {game.awayTeam}
              </p>

            </div>

          </div>

          {/* =====================================================
              JOGO COM RESULTADO
          ===================================================== */}

          {result ? (

            <>
              <div className="mt-5 rounded-xl bg-zinc-900 px-4 py-3 text-center">

                <p className="text-lg font-black text-green-500">
                  Resultado Final
                </p>

              </div>

              <PredictionsList
                gameId={game.id}
                showPoints
              />
            </>

          ) : predictionOpen ? (

            /* =====================================================
               PALPITES AINDA ABERTOS
            ===================================================== */

            <PredictionForm
              gameId={game.id}
            />

          ) : (

            /* =====================================================
               PALPITES ENCERRADOS
            ===================================================== */

            <>
              <div className="mt-5 rounded-xl bg-zinc-900 px-4 py-3 text-center">

                <p className="text-lg font-black text-red-500">
                  🔒 Palpites Encerrados
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Os palpites já podem ser consultados.
                </p>

              </div>

              <PredictionsList
                gameId={game.id}
              />
            </>

          )}

        </div>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-zinc-400 hover:text-white"
        >
          ← Voltar aos Jogos
        </Link>

      </div>

    </main>
  );
}