/**
 * DataCoins Feature
 * Muestra métricas ambientales tokenizadas y verificadas.
 */
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

type DataCoin = {
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  lighthouse_hash: string;
  ipfs_url?: string;
};

export default function DataCoinsList() {
  const { user } = useUser();
  const [datacoins, setDatacoins] = useState<DataCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.companyId) return;
    setLoading(true);
    fetch(`http://localhost:8000/api/v1/datacoins/company/${user.companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setDatacoins(data.datacoins);
        setLoading(false);
      });
  }, [user.companyId]);

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-green-700 mb-2">Tus DataCoins</h2>
      {loading ? (
        <div className="text-gray-500">Cargando...</div>
      ) : datacoins.length === 0 ? (
        <div className="text-gray-500">No hay DataCoins registradas.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Tipo</th>
                <th className="px-2 py-1 text-left">Valor</th>
                <th className="px-2 py-1 text-left">Unidad</th>
                <th className="px-2 py-1 text-left">Fecha</th>
                <th className="px-2 py-1 text-left">Hash</th>
                <th className="px-2 py-1 text-left">IPFS</th>
              </tr>
            </thead>
            <tbody>
              {datacoins.map((dc, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1">{dc.metric_type}</td>
                  <td className="px-2 py-1">{dc.value}</td>
                  <td className="px-2 py-1">{dc.unit}</td>
                  <td className="px-2 py-1">{new Date(dc.timestamp).toLocaleString()}</td>
                  <td className="px-2 py-1 break-all">{dc.lighthouse_hash}</td>
                  <td className="px-2 py-1">
                    {dc.ipfs_url ? (
                      <a href={dc.ipfs_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
        </div>
      )}
    </div>
  );
}
