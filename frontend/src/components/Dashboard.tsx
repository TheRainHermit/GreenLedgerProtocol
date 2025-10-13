/**
 * Dashboard Component
 * Muestra el panel principal con métricas de sostenibilidad y acceso a features clave.
 */
import React from "react";
import EcoScoreAnalytics from "./EcoScoreAnalytics";
import Leaderboard from "./Leaderboard";
import RewardSystem from "../features/RewardSystem";
import PushNotifications from "../features/PushNotifications";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-green-700">GreenLedger Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <PushNotifications />
        </div>
        
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <EcoScoreAnalytics />
        </section>
        <aside className="space-y-6">
          <Leaderboard />
          <RewardSystem />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
