/**
 * EcoScoreAnalytics Component
 * Muestra métricas y análisis del EcoScore basado en datos ambientales.
 */
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type ScoreHistoryItem = {
  date: string;
  score: number;
  change: number;
  rank: number;
};

export default function EcoScoreAnalytics() {
  const { user } = useUser();
  const [score, setScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.companyId) return;
    setLoading(true);

    fetch(`http://localhost:8000/api/v1/scores/${user.companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScore(data.current_score);
          setRank(data.ranking_position);
        }
      });

    fetch(`http://localhost:8000/api/v1/scores/${user.companyId}/history`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.score_history);
        }
        setLoading(false);
      });
  }, [user.companyId]);

  // Datos para la gráfica
  const chartData = {
    labels: history.map(item => item.date).reverse(),
    datasets: [
      {
        label: "EcoScore",
        data: history.map(item => item.score).reverse(),
        fill: false,
        borderColor: "#16a34a",
        backgroundColor: "#16a34a",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: { min: 0, max: 100, title: { display: true, text: "EcoScore" } },
      x: { title: { display: true, text: "Fecha" } },
    },
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-green-700 mb-2">EcoScore Actual</h2>
      {loading ? (
        <div className="text-gray-500">Cargando...</div>
      ) : (
        <>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl font-bold text-green-600">{score ?? "--"}</span>
            <span className="text-gray-500">/ 100</span>
            {rank !== null && (
              <span className="ml-4 text-sm text-gray-600">
                Ranking: <span className="font-semibold">{rank}</span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">Historial reciente</h3>
          <div className="mb-4">
            <Line data={chartData} options={chartOptions} height={120} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Fecha</th>
                  <th className="px-2 py-1 text-left">Score</th>
                  <th className="px-2 py-1 text-left">Cambio</th>
                  <th className="px-2 py-1 text-left">Ranking</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-2 py-1">{item.date}</td>
                    <td className="px-2 py-1">{item.score}</td>
                    <td className={`px-2 py-1 ${item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : ""}`}>
                      {item.change > 0 ? "+" : ""}
                      {item.change}
                    </td>
                    <td className="px-2 py-1">{item.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
