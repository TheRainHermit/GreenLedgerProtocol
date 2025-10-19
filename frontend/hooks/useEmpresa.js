import { useApi } from './useApi'
import { useState, useEffect } from 'react'

export function useEmpresa(empresaWallet) {
  const { get, post, isConnected } = useApi()
  const [empresa, setEmpresa] = useState(null)
  const [metricas, setMetricas] = useState([])
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && empresaWallet) {
      loadEmpresa()
      loadMetricas()
      loadScore()
    }
  }, [isConnected, empresaWallet])

  const loadEmpresa = async () => {
    setLoading(true)
    try {
      const data = await get(`/api/v1/empresas/${empresaWallet}`)
      setEmpresa(data.empresa)
    } catch (error) {
      setEmpresa(null)
    }
    setLoading(false)
  }

  const loadMetricas = async () => {
    setLoading(true)
    try {
      const data = await get(`/api/v1/empresas/${empresaWallet}/metricas`)
      setMetricas(data.metricas || [])
    } catch (error) {
      setMetricas([])
    }
    setLoading(false)
  }

  const loadScore = async () => {
    setLoading(true)
    try {
      const data = await get(`/api/v1/empresas/${empresaWallet}/score`)
      setScore(data.score)
    } catch (error) {
      setScore(null)
    }
    setLoading(false)
  }

  const registrarEmpresa = async (nombre, sector, pais) => {
    return await post('/api/v1/empresas/registrar', { nombre, sector, pais })
  }

  const agregarRepresentante = async (representante) => {
    return await post(`/api/v1/empresas/${empresaWallet}/representantes/agregar`, { representante })
  }

  const eliminarRepresentante = async (representante) => {
    return await post(`/api/v1/empresas/${empresaWallet}/representantes/eliminar`, { representante })
  }

  const registrarMetrica = async (tipo, valor, unidad) => {
    return await post(`/api/v1/empresas/${empresaWallet}/metricas/registrar`, { tipo, valor, unidad })
  }

  const reclamarRecompensa = async (amount) => {
    return await post(`/api/v1/empresas/${empresaWallet}/recompensa/reclamar`, { amount })
  }

  const mintearNFTReconocimiento = async (uri) => {
    return await post(`/api/v1/empresas/${empresaWallet}/nft/mintear`, { uri })
  }

  return {
    empresa,
    metricas,
    score,
    loading,
    loadEmpresa,
    loadMetricas,
    loadScore,
    registrarEmpresa,
    agregarRepresentante,
    eliminarRepresentante,
    registrarMetrica,
    reclamarRecompensa,
    mintearNFTReconocimiento
  }
}
