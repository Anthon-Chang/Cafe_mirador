import { useState, useEffect, useCallback } from "react"
import { productosService } from "../services/menuManagerService"

export function useProductos() {
    const [productos, setProductos] = useState([])
    const [loading, setLoading]     = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError]         = useState(null)
    const [success, setSuccess]     = useState(null)

    // ── Fetch ────────────────────────────────────────────────────
    const fetchProductos = useCallback(async () => {
        try {
            setLoading(true)
            const data = await productosService.getAll()
            setProductos(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProductos() }, [fetchProductos])

    // ── Crear ────────────────────────────────────────────────────
    const crearProducto = useCallback(async (datos) => {
        try {
            setGuardando(true)
            const res = await productosService.create(datos)
            setProductos(prev => [res.producto, ...prev])
            setSuccess("Producto creado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    // ── Actualizar ───────────────────────────────────────────────
    const actualizarProducto = useCallback(async (id, datos) => {
        try {
            setGuardando(true)
            const res = await productosService.update(id, datos)
            setProductos(prev =>
                prev.map(p => p._id === id ? res.producto : p)
            )
            setSuccess("Producto actualizado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    // ── Eliminar ─────────────────────────────────────────────────
    const eliminarProducto = useCallback(async (id) => {
        try {
            setGuardando(true)
            await productosService.delete(id)
            setProductos(prev => prev.filter(p => p._id !== id))
            setSuccess("Producto eliminado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    const clearMessages = useCallback(() => {
        setError(null)
        setSuccess(null)
    }, [])

    return {
        productos,
        loading,
        guardando,
        error,
        success,
        fetchProductos,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
        clearMessages,
    }
}