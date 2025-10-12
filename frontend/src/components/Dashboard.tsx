/**
 * Dashboard Component
 * Muestra el panel principal con métricas de sostenibilidad y acceso a features clave.
 */
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <section className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-green-700 mb-4">🌿 GreenLedger Dashboard</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>EcoScore Analytics</li>
        <li>Company Leaderboard</li>
        <li>Rewards Overview</li>
        <li>Certification NFTs</li>
      </ul>
    </section>
  );
};

export default Dashboard;
