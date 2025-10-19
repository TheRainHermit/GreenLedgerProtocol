import React, { useState } from "react";
import { ethers } from "ethers";
import { useUser } from "../context/UserContext";

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login real con wallet
  const handleWalletLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask no detectado");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // 1. Obtener mensaje a firmar del backend
      const msgRes = await fetch("http://localhost:8000/api/v1/wallet/signature-message");
      const { message } = await msgRes.json();

      // 2. Firmar el mensaje
      const signature = await signer.signMessage(message);

      // 3. Enviar datos al backend para login/asociación
      const res = await fetch("http://localhost:8000/api/v1/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: address, // O companyId si tu backend lo requiere
          address,
          message,
          signature,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setUser({
          name: "Usuario Wallet",
          companyId: address, // O el companyId real si lo devuelve el backend
          walletAddress: address,
        });
        onLogin && onLogin();
      } else {
        setError(data.message || "Error al conectar la wallet");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar la wallet");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Iniciar Sesión</h2>
        <button
          onClick={handleWalletLogin}
          className="w-full flex items-center justify-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
            <path fill="#fff" d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5H7a1.5 1.5 0 0 1 0-3h14v-3H7a1.5 1.5 0 0 1 0-3h14Z"/>
          </svg>
          {loading ? "Procesando..." : "Entrar con Wallet"}
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
}