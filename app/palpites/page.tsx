import Header from "../components/Header";
import Navbar from "../components/Navbar";
import PredictionList from "../components/PredictionList";

export default function PalpitesPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white">

      <div className="mx-auto max-w-5xl px-4">

        <Header />

        <hr className="border-zinc-800" />

        <Navbar />

        <div className="py-6">

          <h1 className="mb-6 text-2xl font-black">
            📊 Os Meus Palpites
          </h1>

          <PredictionList />

        </div>

      </div>

    </main>
  );
}