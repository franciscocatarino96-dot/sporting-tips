"use client";

import { useAuth } from "@/app/providers/AuthProvider";

export default function Header() {
  const { user, loading } = useAuth();

  const initials = user?.code.slice(0, 2);

  if (loading) {
    return (
      <header className="flex items-center justify-between py-5">

        <div>

          <h1 className="text-xl font-black tracking-wide text-green-500">
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

      <div>

        <h1 className="text-xl font-black tracking-wide text-whtite">
          Liga Palpites
        </h1>

        <p className="mt-1 text-[11px] text-zinc-500">
          Liga Portugal Betclic 26/27
        </p>

      </div>

      <div className="rounded-xl border border-zinc-600 bg-zinc-700 px-5 py-3 text-center">

  <p className="text-normal font-black text-white">
    {initials}
  </p>

</div>

    </header>
  );
}