/**
 * Leaderboard Component
 * Muestra el ranking en tiempo real de empresas sostenibles.
 */
import React, { useEffect, useState } from "react";

type LeaderboardItem = {
  company_id: string;
  name: string;
  eco_score: number;
  rank: number;
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/scores/leaderboard/global?limit=10")
      .then(res => res.json())
      .then(data => {
        if (data.success) setLeaderboard(data.leaderboard);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-green-700 mb-2">Top EcoScores</h2>
      {loading ? (
        <div className="text-gray-500">Cargando...</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">#</th>
              <th className="px-2 py-1 text-left">Empresa</th>
              <th className="px-2 py-1 text-left">EcoScore</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item, idx) => (
              <tr key={item.company_id} className="border-t">
                <td className="px-2 py-1">{item.rank}</td>
                <td className="px-2 py-1">{item.name}</td>
                <td className="px-2 py-1">{item.eco_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
