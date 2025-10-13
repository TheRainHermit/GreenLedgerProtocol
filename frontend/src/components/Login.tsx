import React, { useState } from "react";
import { ethers } from "ethers";

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      onLogin && onLogin();
    }, 1000);
  };

  const handleGmailLogin = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      onLogin && onLogin();
    }, 1000);
  };

  const handleWalletLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask no detectado");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      await signer.getAddress();
      setLoading(false);
      onLogin && onLogin();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error al conectar la wallet");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Entrar con correo"}
          </button>
        </form>
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-2 text-gray-400">o</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <button
          onClick={handleGmailLogin}
          className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Gmail"
            className="w-5 h-5 mr-2"
          />
          {loading ? "Procesando..." : "Entrar con Gmail"}
        </button>
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