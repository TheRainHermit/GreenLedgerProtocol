// Script para registrar un subcontrato en MasterEcologicalContract
// Ejecuta con: npx hardhat run scripts/register_subcontract.js --network <tuRed>

const { ethers } = require("hardhat");

async function main() {
  // Dirección del contrato maestro (ajusta según tu despliegue)
  const masterAddress = "<DIRECCION_CONTRATO_MAESTRO>";
  // Dirección del subcontrato a registrar
  const subcontractAddress = "<DIRECCION_SUBCONTRATO>";
  // ID del servicio (puedes usar el hash de un string)
  const servicioId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("servicio1"));

  // Obtén el signer (debe ser el owner del contrato)
  const [owner] = await ethers.getSigners();

  // Obtén la instancia del contrato
  const MasterEcologicalContract = await ethers.getContractFactory("MasterEcologicalContract");
  const master = MasterEcologicalContract.attach(masterAddress);

  // Ejecuta el registro
  const tx = await master.connect(owner).registrarSubcontrato(servicioId, subcontractAddress);
  console.log("Transacción enviada:", tx.hash);
  await tx.wait();
  console.log("Subcontrato registrado correctamente");
  console.log("servicioId:", servicioId);
  console.log("subcontrato:", subcontractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
