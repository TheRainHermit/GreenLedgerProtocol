/**
 * DataCoins Feature
 * Muestra métricas ambientales tokenizadas y verificadas.
 */
import React, { useState } from "react";

const DataCoins: React.FC = () => {
  // Simulación de balance y transacciones
  const [balance, setBalance] = useState(1200);
  const transactions = [
    { id: 1, type: "Recibido", amount: 200, date: "2025-10-10" },
    { id: 2, type: "Gastado", amount: -50, date: "2025-10-09" },
    { id: 3, type: "Recibido", amount: 100, date: "2025-10-07" },
  ];

  return (
    <section className="card flex flex-col space-y-4">
      <h2 className="text-xl font-semibold text-green-700">DataCoins</h2>
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold text-green-600">{balance}</span>
        <span className="text-gray-500">DC</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Movimientos recientes</h3>
        <ul className="divide-y divide-gray-200">
          {transactions.map(tx => (
            <li key={tx.id} className="flex justify-between py-2 text-sm">
              <span>
                {tx.type}{" "}
                <span className={tx.amount > 0 ? "text-green-600" : "text-red-500"}>
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount} DC
                </span>
              </span>
              <span className="text-gray-400">{tx.date}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition self-end"
        onClick={() => setBalance(balance + 100)}
      >
        Simular ingreso +100 DC
      </button>
    </section>
  );
};

export default DataCoins;
