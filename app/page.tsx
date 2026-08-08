"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import GameList from "./components/GameList";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
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

        <GameList />
      </div>
    </main>
  );
}