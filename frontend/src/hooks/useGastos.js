import { useState, useEffect, useCallback } from "react"
import { gastosService } from "../services/gastosService"

export function useGastos() {
    const [gastos, setGastos]       = useState([])
    const [loading, setLoading]     = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError]         = useState(null)
    const [success, setSuccess]     = useState(null)

    const fetchGastos = useCallback(async () => {
        try {
            setLoading(true)
            const data = await gastosService.getAll()
            setGastos(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchGastos() }, [fetchGastos])

    const crearGasto = useCallback(async (datos) => {
        try {
            setGuardando(true)
            const res = await gastosService.crear(datos)
            setGastos(prev => [res.gasto, ...prev])
            setSuccess("Gasto registrado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    const actualizarGasto = useCallback(async (id, datos) => {
        try {
            setGuardando(true)
            const res = await gastosService.actualizar(id, datos)
            setGastos(prev => prev.map(g => g._id === id ? res.gasto : g))
            setSuccess("Gasto actualizado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    const toggleGasto = useCallback(async (id) => {
        try {
            setGuardando(true)
            const res = await gastosService.toggle(id)
            setGastos(prev => prev.map(g => g._id === id ? res.gasto : g))
            setSuccess(res.msg)
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    const eliminarGasto = useCallback(async (id) => {
        try {
            setGuardando(true)
            await gastosService.eliminar(id)
            setGastos(prev => prev.filter(g => g._id !== id))
            setSuccess("Gasto eliminado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    const clearMessages = useCallback(() => { setError(null); setSuccess(null) }, [])

    return {
        gastos, loading, guardando, error, success,
        fetchGastos, crearGasto, actualizarGasto, toggleGasto, eliminarGasto, clearMessages,
    }
}