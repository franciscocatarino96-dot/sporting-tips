"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ChampionsGameList from "../components/ChampionsGameList";
import { useAuth } from "../providers/AuthProvider";

export default function ChampionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white">

      <div className="mx-auto max-w-5xl px-4">

        <Header />

        <hr className="border-zinc-800" />

        <Navbar />

        <div className="py-6">

          <h1 className="mb-5 text-xl font-black">
            ⭐ Champions League
          </h1>

          <ChampionsGameList />

        </div>

      </div>

    </main>
  );
}