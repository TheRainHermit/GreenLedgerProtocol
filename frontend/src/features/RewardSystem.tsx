import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

type RewardHistoryItem = {
  amount: number;
  reward_date: string;
  reason?: string;
  transaction_hash?: string;
};

export default function RewardSystem() {
  const { user } = useUser();
  const [history, setHistory] = useState<RewardHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.companyId) return;
    fetch(`http://localhost:8000/api/v1/rewards/company/${user.companyId}/history`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHistory(data.history);
        setLoading(false);
      });
  }, [user.companyId]);

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-green-700 mb-2">Historial de Recompensas</h2>
      {loading ? (
        <div className="text-gray-500">Cargando...</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500">No hay recompensas registradas.</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">Fecha</th>
              <th className="px-2 py-1 text-left">Monto</th>
              <th className="px-2 py-1 text-left">Motivo</th>
              <th className="px-2 py-1 text-left">Tx</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-2 py-1">{new Date(item.reward_date).toLocaleDateString()}</td>
                <td className="px-2 py-1">{item.amount}</td>
                <td className="px-2 py-1">{item.reason || "-"}</td>
                <td className="px-2 py-1 break-all">
                  {item.transaction_hash ? (
                    <a
                      href={`https://explorer.blockchain.com/tx/${item.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}