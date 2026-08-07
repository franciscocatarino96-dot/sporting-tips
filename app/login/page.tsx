"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/app/lib/users";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function login() {
    console.log("Botão clicado");
    console.log("Código:", code);

    const user = users.find(
      (u) => u.code.toUpperCase() === code.trim().toUpperCase()
    );

    console.log("Utilizador encontrado:", user);

    if (!user) {
      alert("Código inválido!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    alert(`Bem-vindo ${user.name}`);

    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 p-8">

        <h1 className="text-center text-3xl font-black text-white">
          Lions League
        </h1>

        <p className="mt-2 text-center text-zinc-400">
          Introduz o teu código
        </p>

        <input
          type="text"
          placeholder="FC01"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-8 w-full rounded-xl bg-zinc-900 p-4 text-center text-xl uppercase text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="button"
          onClick={login}
          className="mt-6 w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-500"
        >
          Entrar
        </button>

      </div>
    </main>
  );
}