"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items = [
    {
      href: "/",
      icon: "⚽",
      label: "Jogos",
    },
    {
      href: "/palpites",
      icon: "📊",
      label: "Palpites",
    },
    {
      href: "/classificacao",
      icon: "🏆",
      label: "Classificação",
    },
    {
      href: "/regulamento",
      icon: "📖",
      label: "Regras",
    },
  ];

  if (user?.admin) {
    items.push({
      href: "/admin",
      icon: "🛠️",
      label: "Admin",
    });
  }

  return (
    <nav className="mt-3 flex gap-2 overflow-x-auto">

      {items.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              active
                ? "bg-zinc-600 text-white shadow-md"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>

            <span>{item.label}</span>
          </Link>
        );
      })}

    </nav>
  );
}