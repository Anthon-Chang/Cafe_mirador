import { useState, useEffect, useCallback } from "react"
import { io } from "socket.io-client"
import { pedidosService } from "../services/pedidosService"
import { API_URL } from "../utils/constants"

export function usePedidos() {
    const [pedidos,        setPedidos]        = useState([])
    const [stats,          setStats]          = useState(null)
    const [loadingPedidos, setLoadingPedidos] = useState(true)
    const [loadingStats,   setLoadingStats]   = useState(true)
    const [error,          setError]          = useState(null)
    const [cambiando,      setCambiando]      = useState(null)

    // ── Fetches ───────────────────────────────────────────────────
    const fetchPedidos = useCallback(async () => {
        try {
            setLoadingPedidos(true)
            const data = await pedidosService.getActivos()
            setPedidos(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoadingPedidos(false)
        }
    }, [])

    const fetchStats = useCallback(async () => {
        try {
            setLoadingStats(true)
            const data = await pedidosService.getEstadisticas()
            setStats(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoadingStats(false)
        }
    }, [])

    // ── Acciones ──────────────────────────────────────────────────
    const cambiarEstado = useCallback(async (id, nuevoEstado) => {
        try {
            setCambiando(id)
            await pedidosService.actualizarEstado(id, nuevoEstado)
            // La UI se actualiza por Socket.io, no se necesita refetch
        } catch (e) {
            setError(e.message)
        } finally {
            setCambiando(null)
        }
    }, [])

    const eliminarPedido = useCallback(async (id) => {
        try {
            setCambiando(id)
            await pedidosService.eliminar(id)
            setPedidos(prev => prev.filter(p => p._id !== id))
            await fetchStats()
        } catch (e) {
            setError(e.message)
        } finally {
            setCambiando(null)
        }
    }, [fetchStats])

    const clearError = useCallback(() => setError(null), [])

    const refresh = useCallback(() => {
        fetchPedidos()
        fetchStats()
    }, [fetchPedidos, fetchStats])

    // ── Socket.io en tiempo real + carga inicial ──────────────────
    useEffect(() => {
        fetchPedidos()
        fetchStats()

        const socket = io(API_URL)

        socket.on("nuevoPedido", (pedido) => {
            if (["pendiente", "procesando"].includes(pedido.estado)) {
                setPedidos(prev => [pedido, ...prev])
            }
            fetchStats()
        })

        socket.on("pedidoActualizado", (actualizado) => {
            setPedidos(prev => {
                if (!["pendiente", "procesando"].includes(actualizado.estado)) {
                    return prev.filter(p => p._id !== actualizado._id)
                }
                return prev.map(p => p._id === actualizado._id ? actualizado : p)
            })
            fetchStats()
        })

        socket.on("pedidoEliminado", ({ _id }) => {
            setPedidos(prev => prev.filter(p => p._id !== _id))
            fetchStats()
        })

        return () => socket.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        pedidos,
        stats,
        loadingPedidos,
        loadingStats,
        error,
        cambiando,
        cambiarEstado,
        eliminarPedido,
        clearError,
        refresh,
    }
}