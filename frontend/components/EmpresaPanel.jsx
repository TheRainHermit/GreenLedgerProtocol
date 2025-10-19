import React, { useState } from 'react'
import { useEmpresa } from '../hooks/useEmpresa'

export default function EmpresaPanel({ empresaWallet }) {
  const {
    empresa,
    metricas,
    score,
    loading,
    registrarEmpresa,
    agregarRepresentante,
    eliminarRepresentante,
    registrarMetrica,
    reclamarRecompensa,
    mintearNFTReconocimiento
  } = useEmpresa(empresaWallet)

  const [form, setForm] = useState({ nombre: '', sector: '', pais: '' })
  const [metrica, setMetrica] = useState({ tipo: '', valor: '', unidad: '' })
  const [representante, setRepresentante] = useState('')
  const [nftUri, setNftUri] = useState('')
  const [recompensa, setRecompensa] = useState(0)

  return (
    <div className="eco-panel p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Panel Empresa</h2>
      {loading && <div>Cargando...</div>}
      {empresa ? (
        <div>
          <div className="mb-2">Empresa: <strong>{empresa.nombre}</strong></div>
          <div className="mb-2">Sector: {empresa.sector}</div>
          <div className="mb-2">País: {empresa.pais}</div>
          <div className="mb-2">Score Ambiental: <span className="font-bold text-green-700">{score}</span></div>
          <div className="mb-2">Representantes: {empresa.representantes?.join(', ')}</div>
          <div className="mb-4">Métricas:
            <ul>
              {metricas.map((m, i) => (
                <li key={i}>{m.tipo}: {m.valor} {m.unidad}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Wallet representante" value={representante} onChange={e => setRepresentante(e.target.value)} />
            <button onClick={() => agregarRepresentante(representante)}>Agregar representante</button>
            <button onClick={() => eliminarRepresentante(representante)}>Eliminar representante</button>
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Tipo métrica" value={metrica.tipo} onChange={e => setMetrica({ ...metrica, tipo: e.target.value })} />
            <input type="number" placeholder="Valor" value={metrica.valor} onChange={e => setMetrica({ ...metrica, valor: e.target.value })} />
            <input type="text" placeholder="Unidad" value={metrica.unidad} onChange={e => setMetrica({ ...metrica, unidad: e.target.value })} />
            <button onClick={() => registrarMetrica(metrica.tipo, metrica.valor, metrica.unidad)}>Registrar métrica</button>
          </div>
          <div className="mb-4">
            <input type="number" placeholder="Cantidad recompensa" value={recompensa} onChange={e => setRecompensa(e.target.value)} />
            <button onClick={() => reclamarRecompensa(recompensa)}>Reclamar recompensa</button>
          </div>
          <div className="mb-4">
            <input type="text" placeholder="URI NFT" value={nftUri} onChange={e => setNftUri(e.target.value)} />
            <button onClick={() => mintearNFTReconocimiento(nftUri)}>Mintear NFT reconocimiento</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>Registrar nueva empresa</h3>
          <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          <input type="text" placeholder="Sector" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} />
          <input type="text" placeholder="País" value={form.pais} onChange={e => setForm({ ...form, pais: e.target.value })} />
          <button onClick={() => registrarEmpresa(form.nombre, form.sector, form.pais)}>Registrar empresa</button>
        </div>
      )}
    </div>
  )
}
