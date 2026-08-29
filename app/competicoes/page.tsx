"use client";

import Image from "next/image";
import Link from "next/link";

export default function CompeticoesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">

      <div className="mx-auto flex w-full max-w-md flex-col items-center">

        {/* TÍTULO */}

        <h1 className="text-center text-3xl font-black">
          Escolhe a competição
        </h1>

        {/* CARTÕES */}

        <div className="mt-16 flex w-full flex-col items-center gap-5">

          {/* ================================
              LIGA PORTUGAL
          ================================= */}

          <Link
            href="/"
            className="flex h-[275px] w-[330px] flex-col items-center justify-between rounded-2xl bg-zinc-800 p-6 transition hover:bg-zinc-700"
          >

            <div className="flex flex-1 items-center justify-center">

              <Image
                src="/logos/liga-portugal.png"
                alt="Liga Portugal"
                width={110}
                height={110}
                className="max-h-[120px] w-auto object-contain"
              />

            </div>

            <h2 className="mt-3 text-xl font-black">
              Liga Portugal
            </h2>

            <div className="mt-5 w-full rounded-xl bg-green-600 py-3 text-center text-sm font-bold transition hover:bg-green-500">
              Entrar
            </div>

          </Link>


          {/* ================================
              CHAMPIONS LEAGUE
          ================================= */}

          <Link
            href="/champions"
            className="flex h-[275px] w-[330px] flex-col items-center justify-between rounded-2xl bg-zinc-800 p-6 transition hover:bg-zinc-700"
          >

            <div className="flex flex-1 items-center justify-center">

              <Image
                src="/logos/champions.png"
                alt="Champions League"
                width={110}
                height={110}
                className="max-h-[120px] w-auto object-contain"
              />

            </div>

            <h2 className="mt-3 text-xl font-black">
              Champions League
            </h2>

            <div className="mt-5 w-full rounded-xl bg-green-600 py-3 text-center text-sm font-bold transition hover:bg-green-500">
              Entrar
            </div>

          </Link>

        </div>

      </div>

    </main>
  );
}