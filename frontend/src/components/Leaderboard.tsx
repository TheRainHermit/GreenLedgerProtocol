/**
 * Leaderboard Component
 * Muestra el ranking en tiempo real de empresas sostenibles.
 */
import React from "react";

const Leaderboard: React.FC = () => {
  // Simulación de datos
  const leaders = [
    { name: "EcoCorp", score: 95 },
    { name: "GreenTech", score: 90 },
    { name: "PlanetSave", score: 88 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-2">Leaderboard</h2>
      <ol className="space-y-2">
        {leaders.map((l, i) => (
          <li key={i} className="flex justify-between items-center">
            <span className="font-medium">{i + 1}. {l.name}</span>
            <span className="text-green-600 font-bold">{l.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
