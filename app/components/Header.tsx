"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const initials = user?.code.slice(0, 2);

  const isChampions =
    pathname.startsWith("/champions");

  if (loading) {
    return (
      <header className="flex items-center justify-between py-5">

        <div>
          <h1 className="text-xl font-black tracking-wide text-white">
            Liga Palpites
          </h1>

          <p className="mt-1 text-[11px] text-zinc-500">
            Liga Portugal Betclic 26/27
          </p>
        </div>

      </header>
    );
  }

  return (
    <header className="flex items-center justify-between py-5">

      {/* TÍTULO */}

      <div>

        <h1 className="text-xl font-black tracking-wide text-white">
          {isChampions
            ? "Champions Palpites"
            : "Liga Palpites"}
        </h1>

        <p className="mt-1 text-[11px] text-zinc-500">
          {isChampions
            ? "Champions League 26/27"
            : "Liga Portugal Betclic 26/27"}
        </p>

      </div>

      {/* COMPETIÇÃO + UTILIZADOR */}

      <div className="flex items-center gap-2">

        {/* LOGO DA OUTRA COMPETIÇÃO */}

        {isChampions ? (

          <Link
            href="/"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-zinc-600 bg-zinc-700 p-2 transition hover:bg-zinc-600"
            title="Liga Portugal"
          >
            <Image
              src="/logos/liga-portugal.png"
              alt="Liga Portugal"
              width={38}
              height={38}
              className="h-full w-full object-contain"
            />
          </Link>

        ) : (

          <Link
            href="/champions"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-zinc-600 bg-zinc-700 p-2 transition hover:bg-zinc-600"
            title="Champions League"
          >
            <Image
              src="/logos/champions.png"
              alt="Champions League"
              width={38}
              height={38}
              className="h-full w-full object-contain"
            />
          </Link>

        )}

        {/* UTILIZADOR */}

        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-zinc-600 bg-zinc-700 text-center">

          <p className="font-black text-white">
            {initials}
          </p>

        </div>

      </div>

    </header>
  );
}