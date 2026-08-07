import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function RegulamentoPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <div className="mx-auto max-w-5xl px-4">

        <Header />

        <hr className="border-zinc-800" />

        <Navbar />

        <div className="py-6">

          <h1 className="mb-6 text-2xl font-black">
            📖 Regulamento
          </h1>

          {/* Objetivo */}

          <Section title="🏆 Objetivo">
            <p>
              O <strong>Sporting Tips</strong> é um concurso privado de palpites
              dedicado aos jogos do Sporting Clube de Portugal na Liga Portugal
              Betclic 2026/27.
            </p>

            <p className="mt-3">
              Ao longo da época, os participantes acumulam pontos jornada após
              jornada. No final da temporada será apurada a classificação final
              e atribuídos os respetivos prémios.
            </p>
          </Section>

          {/* Participantes */}

          <Section title="👥 Participantes">
            <ul className="list-disc space-y-2 pl-5">
              <li>O concurso é exclusivo para os membros do grupo.</li>
              <li>Não serão aceites novos participantes após o início da competição.</li>
            </ul>
          </Section>

          {/* Palpites */}

          <Section title="⏰ Palpites">
            <ul className="list-disc space-y-2 pl-5">
              <li>Os palpites são submetidos através da aplicação.</li>
              <li>Os palpites encerram <strong>5 minutos antes</strong> do início oficial do jogo.</li>
              <li>Após o fecho não é possível alterar nem submeter novos palpites.</li>
            </ul>
          </Section>

          {/* Resultado */}

          <Section title="⚽ Resultado Válido">
            <ul className="list-disc space-y-2 pl-5">
              <li>Conta apenas o resultado no final do tempo regulamentar.</li>
              <li>São considerados os 90 minutos mais tempo de compensação.</li>
              <li>Prolongamentos e desempates por penáltis não contam.</li>
            </ul>
          </Section>

          {/* Pontuação */}

          <Section title="🎯 Sistema de Pontuação">

            <div className="overflow-hidden rounded-lg border border-zinc-700">

              <table className="w-full text-sm">

                <thead className="bg-zinc-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Acerto
                    </th>

                    <th className="px-4 py-3 text-right">
                      Pontos
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr className="border-t border-zinc-700">
                    <td className="px-4 py-3">
                      🎯 Resultado exato
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-green-400">
                      7
                    </td>
                  </tr>

                  <tr className="border-t border-zinc-700">
                    <td className="px-4 py-3">
                      ✅ Tendência correta
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-green-400">
                      3
                    </td>
                  </tr>

                  <tr className="border-t border-zinc-700">
                    <td className="px-4 py-3">
                      ⚽ Golos marcados pelo Sporting
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-green-400">
                      1
                    </td>
                  </tr>

                  <tr className="border-t border-zinc-700">
                    <td className="px-4 py-3">
                      🥅 Golos sofridos pelo Sporting
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-green-400">
                      1
                    </td>
                  </tr>

                  <tr className="border-t border-zinc-700">
                    <td className="px-4 py-3">
                      ❌ Sem qualquer acerto
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-red-400">
                      0
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </Section>

          {/* Desempate */}

          <Section title="🥇 Critérios de Desempate">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Maior número de resultados exatos.</li>
              <li>Maior número de tendências corretas.</li>
              <li>Caso o empate persista, o prémio será dividido.</li>
            </ol>
          </Section>

          {/* Prémios */}

          <Section title="🎁 Prémios">
            <ul className="space-y-3">
              <li><strong>🥇 1.º Lugar</strong> — Camisola Oficial do Sporting CP</li>
              <li><strong>🥈 2.º Lugar</strong> — Cachecol Oficial do Sporting CP</li>
              <li><strong>🥉 3.º Lugar</strong> — Lembrança Oficial do Sporting CP</li>
            </ul>

            <p className="mt-4 text-sm text-zinc-400">
              Os prémios serão entregues após a conclusão da última jornada da
              Liga Portugal Betclic 2026/27.
            </p>
          </Section>

          {/* Fair Play */}

          <Section title="🤝 Fair Play">
            <p>
              O principal objetivo desta competição é promover a diversão, o
              convívio e o espírito desportivo entre amigos.
            </p>

            <p className="mt-3">
              Qualquer situação não prevista neste regulamento será decidida por
              consenso entre os participantes.
            </p>
          </Section>

          {/* Rodapé */}

          <div className="mt-8 rounded-xl border border-zinc-600 bg-zinc-600 p-4 text-center">

            <p className="text-xs font-bold text-WHITE">
              v1.0 by Francisco Catarino
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              Liga Portugal Betclic 2026/27
            </p>

            <p className="mt-3 text-xs text-zinc-500">
              Version 1.0
            </p>

            <p className="text-xs text-zinc-500">
              Made by Francisco Catarino
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-800 p-5">

      <h2 className="mb-4 text-lg font-bold">
        {title}
      </h2>

      <div className="space-y-2 text-sm leading-7 text-zinc-300">
        {children}
      </div>

    </div>
  );
}