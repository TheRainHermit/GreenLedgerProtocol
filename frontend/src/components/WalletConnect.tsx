import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ companyId, onWalletConnected }: { companyId: string, onWalletConnected: (address: string) => void }) {
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setStatus("Solicitando mensaje...");
    // 1. Obtener mensaje del backend
    const msgRes = await fetch("/api/v1/wallet/signature-message");
    const { message } = await msgRes.json();

    // 2. Solicitar firma al usuario
    if (!(window as any).ethereum) {
      setStatus("MetaMask no detectado");
      return;
    }
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const signature = await signer.signMessage(message);

    // 3. Enviar datos al backend
    setStatus("Conectando con backend...");
    const res = await fetch("/api/v1/wallet/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: companyId,
        address: userAddress,
        message,
        signature,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setAddress(userAddress);
      setStatus("Wallet conectada correctamente");
      onWalletConnected && onWalletConnected(userAddress);
    } else {
      setStatus("Error: " + (data.message || "No se pudo conectar"));
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Conectar Wallet
      </button>
      {status && <div className="text-sm">{status}</div>}
      {address && (
        <div className="text-xs text-gray-500 break-all">
          Dirección: {address}
        </div>
      )}
    </div>
  );
}