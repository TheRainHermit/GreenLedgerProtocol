/**
 * CertificationNFT Feature
 * Muestra el certificado NFT dinámico que evoluciona con el EcoScore.
 */
import React from "react";

const CertificationNFT: React.FC = () => {
  // Simulación de datos del NFT
  const ecoScore = 82;
  const nftLevel = ecoScore >= 90 ? "Oro" : ecoScore >= 75 ? "Plata" : "Bronce";
  const nftImage =
    nftLevel === "Oro"
      ? "/nft-gold.png"
      : nftLevel === "Plata"
      ? "/nft-silver.png"
      : "/nft-bronze.png";

  return (
    <section className="card flex flex-col items-center text-center space-y-4">
      <h2 className="text-xl font-semibold text-green-700">Certificado NFT</h2>
      <img
        src={nftImage}
        alt={`NFT nivel ${nftLevel}`}
        className="w-32 h-32 rounded-lg shadow-md border-4 border-green-200 object-cover"
      />
      <div>
        <span className="font-bold text-green-600">Nivel: {nftLevel}</span>
        <p className="text-gray-500 text-sm mt-1">
          Tu certificado evoluciona según tu EcoScore.
        </p>
      </div>
      <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        Ver en blockchain
      </button>
    </section>
  );
};

export default CertificationNFT;
