import Header from "./components/Header";
import Navbar from "./components/Navbar";
import GameList from "./components/GameList";

export default function Home() {
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