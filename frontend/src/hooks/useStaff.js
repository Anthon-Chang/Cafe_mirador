import { useState, useEffect, useCallback } from "react"
import { staffService } from "../services/menuManagerService"

export function useStaff() {
    const [staff, setStaff]         = useState([])
    const [loading, setLoading]     = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError]         = useState(null)
    const [success, setSuccess]     = useState(null)

    // ── Fetch ────────────────────────────────────────────────────
    const fetchStaff = useCallback(async () => {
        try {
            setLoading(true)
            const data = await staffService.getAll()
            // El backend puede devolver array o { usuarios: [] }
            setStaff(Array.isArray(data) ? data : data.usuarios ?? [])
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchStaff() }, [fetchStaff])

    // ── Crear trabajador ─────────────────────────────────────────
    const crearStaff = useCallback(async (datos) => {
        try {
            setGuardando(true)
            const res = await staffService.create(datos)
            // Añadir al listado con datos del formulario
            setStaff(prev => [res.usuario ?? datos, ...prev])
            setSuccess("Trabajador registrado y credenciales enviadas por correo")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    // ── Editar / cambiar rol ──────────────────────────────────────
    const editarStaff = useCallback(async (id, datos) => {
        try {
            setGuardando(true)
            const res = await staffService.update(id, datos)
            setStaff(prev =>
                prev.map(u => u._id === id ? (res.usuario ?? { ...u, ...datos }) : u)
            )
            setSuccess("Trabajador actualizado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    // ── Ascender rol ─────────────────────────────────────────────
    const ascenderRol = useCallback(async (usuario) => {
        const jerarquia = ["trabajador", "supervisor", "administrador"]
        const idx = jerarquia.indexOf(usuario.rol)
        if (idx >= jerarquia.length - 1) {
            setError("Este usuario ya tiene el rol máximo permitido")
            return { ok: false }
        }
        return editarStaff(usuario._id, { rol: jerarquia[idx + 1] })
    }, [editarStaff])

    // ── Descender rol ────────────────────────────────────────────
    const descenderRol = useCallback(async (usuario) => {
        const jerarquia = ["trabajador", "supervisor", "administrador"]
        const idx = jerarquia.indexOf(usuario.rol)
        if (idx <= 0) {
            setError("Este usuario ya tiene el rol mínimo permitido")
            return { ok: false }
        }
        return editarStaff(usuario._id, { rol: jerarquia[idx - 1] })
    }, [editarStaff])

    // ── Eliminar ─────────────────────────────────────────────────
    const eliminarStaff = useCallback(async (id) => {
        try {
            setGuardando(true)
            await staffService.delete(id)
            setStaff(prev => prev.filter(u => u._id !== id))
            setSuccess("Trabajador eliminado correctamente")
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
        staff,
        loading,
        guardando,
        error,
        success,
        fetchStaff,
        crearStaff,
        editarStaff,
        ascenderRol,
        descenderRol,
        eliminarStaff,
        clearMessages,
    }
}