/**
 * Dashboard Component
 * Muestra el panel principal con métricas de sostenibilidad y acceso a features clave.
 */
import React, { useEffect, useState } from "react";
import EcoScoreAnalytics from "./EcoScoreAnalytics";
import Leaderboard from "./Leaderboard";
import RewardSystem from "../features/RewardSystem";
import PushNotifications from "../features/PushNotifications";
import { useUser } from "../context/UserContext";
import WalletConnect from "./WalletConnect";
import DataCoinsList from "../features/DataCoins";
import DataCoinUploadForm from "../features/DataCoinUploadForm";

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);

  // Consultar balance al cargar el Dashboard
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user.walletAddress) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/wallet/balance/${user.walletAddress}`
        );
        const data = await res.json();
        if (data.status === "success") {
          setBalance(data.data);
        }
      } catch {
        setBalance(null);
      }
      setLoading(false);
    };
    fetchBalance();
  }, [user.walletAddress]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/rewards/stats")
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
      });
  }, []);

  useEffect(() => {
    if (!user.companyId) return;
    fetch(`http://localhost:8000/api/v1/rewards/eligibility/${user.companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setEligibility(data);
      });
  }, [user.companyId]);

  const handleDisconnect = async () => {
    if (!user.walletAddress) return;
    setDisconnecting(true);
    try {
      await fetch("http://localhost:8000/api/v1/wallet/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.companyId,
          address: user.walletAddress,
          message: "",
          signature: "",
        }),
      });
      setUser(u => ({ ...u, walletAddress: null }));
      setBalance(null);
    } catch {
      // Manejar error si lo deseas
    }
    setDisconnecting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-green-700">GreenLedger Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <PushNotifications />
        </div>
      </header>
      {/* Wallet Info */}
      <div className="mb-6">
        {user.walletAddress ? (
          <div className="bg-white rounded p-4 shadow flex flex-col md:flex-row md:items-center md:space-x-4">
            <span className="font-semibold text-green-700">Wallet:</span>
            <span className="text-xs break-all">{user.walletAddress}</span>
            <span className="ml-2 text-gray-600">
              {loading
                ? "Consultando balance..."
                : balance !== null
                ? `Balance: ${balance} DC`
                : "Sin balance"}
            </span>
            <button
              onClick={handleDisconnect}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              disabled={disconnecting}
            >
              {disconnecting ? "Desconectando..." : "Desconectar"}
            </button>
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-800 rounded p-4 shadow">
            No hay wallet conectada.
          </div>
        )}
      </div>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <EcoScoreAnalytics />
          <DataCoinUploadForm onUpload={() => setRefresh(r => r + 1)} />
          <DataCoinsList key={refresh} />
        </section>
        <aside className="space-y-6">
          <Leaderboard />
          <RewardSystem />
        </aside>
      </main>
      {stats && (
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-green-700">Total distribuido:</span>{" "}
            {stats.total_distributed_ever} {stats.currency}
          </div>
          <div>
            <span className="font-semibold text-green-700">Promedio recompensa:</span>{" "}
            {stats.average_reward} {stats.currency}
          </div>
          <div>
            <span className="font-semibold text-green-700">Recompensa más alta este mes:</span>{" "}
            {stats.highest_reward_this_month} {stats.currency}
          </div>
          <div>
            <span className="font-semibold text-green-700">Próxima distribución:</span>{" "}
            {new Date(stats.next_distribution_date).toLocaleDateString()}
          </div>
        </div>
      )}
      {eligibility && (
        <div className={`mb-4 p-3 rounded ${eligibility.eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {eligibility.eligible
            ? `¡Eres elegible para recompensas! Estimada: ${eligibility.estimated_reward} PYUSD`
            : "No eres elegible para recompensas este mes."}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
