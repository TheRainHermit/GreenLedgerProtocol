import { useState } from 'react'
import { MASTER_ECOLOGICAL_CONTRACT_ABI, MASTER_ECOLOGICAL_CONTRACT_ADDRESS } from '../hooks/useMasterEcologicalContract'
import { useWeb3 } from '../hooks/useWeb3'

export default function AdminRegisterSubcontract() {
  const { account, isConnected } = useWeb3()
  const [serviceId, setServiceId] = useState('')
  const [subcontractAddress, setSubcontractAddress] = useState('')
  const [txStatus, setTxStatus] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setTxStatus('Procesando...')
    try {
      if (!isConnected || !account) throw new Error('Conecta tu wallet admin')
      let ethers
      try { ethers = await import('ethers') } catch {}
      if (!ethers) throw new Error('ethers.js no disponible')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        MASTER_ECOLOGICAL_CONTRACT_ADDRESS,
        MASTER_ECOLOGICAL_CONTRACT_ABI,
        signer
      )
      // El serviceId debe ser bytes32 (usa hash si es string)
      const serviceIdBytes32 = serviceId.startsWith('0x') && serviceId.length === 66
        ? serviceId
        : ethers.id(serviceId).slice(0,66)
      const tx = await contract.registerService(serviceIdBytes32, subcontractAddress)
      setTxStatus('Esperando confirmación...')
      await tx.wait()
      setTxStatus('✅ Subcontrato registrado con éxito (Tx: ' + tx.hash.slice(0,10) + '...)')
    } catch (e) {
      const msg = e?.message || e?.toString() || ''
      if (msg.includes('not contract')) {
        setTxStatus('❌ La dirección no es un contrato válido.')
      } else if (msg.includes('onlyOwner')) {
        setTxStatus('❌ Solo el owner/admin puede registrar subcontratos.')
      } else {
        setTxStatus('❌ Error: ' + msg.split('\n')[0].slice(0, 300))
      }
    }
  }

  return (
    <div className="eco-card p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-forest">Registrar Subcontrato (Admin)</h3>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-nature-light">
          ID del Servicio (string o bytes32):
          <input
            type="text"
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
            className="eco-input mt-1"
            placeholder="ej: servicio1"
            required
          />
        </label>
        <label className="text-sm font-semibold text-nature-light">
          Dirección del Subcontrato:
          <input
            type="text"
            value={subcontractAddress}
            onChange={e => setSubcontractAddress(e.target.value)}
            className="eco-input mt-1"
            placeholder="0x..."
            required
          />
        </label>
        <button type="submit" className="eco-btn bg-gradient-to-r from-green-500 to-green-700 text-white font-bold border-2 border-green-600 shadow hover:scale-105 transition-all">
          Registrar
        </button>
        {txStatus && <div className="mt-2 text-xs text-nature-light">{txStatus}</div>}
      </form>
    </div>
  )
}
