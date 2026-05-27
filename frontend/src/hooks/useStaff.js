import { useState, useEffect, useCallback } from "react"
import { staffService } from "../services/menuManagerService"

const JERARQUIA = ["cliente", "trabajador", "supervisor", "administrador", "superadmin"]
const ROLES_STAFF = ["trabajador", "supervisor", "administrador"]

/** Rol dominante: el de mayor jerarquía dentro del array */
export const rolDominante = (roles = []) =>
    [...roles].sort((a, b) => JERARQUIA.indexOf(b) - JERARQUIA.indexOf(a))[0] ?? "cliente"

export function useStaff() {
    const [staff, setStaff]         = useState([])
    const [loading, setLoading]     = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError]         = useState(null)
    const [success, setSuccess]     = useState(null)

    const fetchStaff = useCallback(async () => {
        try {
            setLoading(true)
            const data = await staffService.getAll()
            setStaff(Array.isArray(data) ? data : data.usuarios ?? [])
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchStaff() }, [fetchStaff])

    // ── Crear / promover a staff ──────────────────────────────────
    const crearStaff = useCallback(async (datos) => {
        try {
            setGuardando(true)
            const res = await staffService.create(datos)
            // El backend puede devolver un usuario existente actualizado o uno nuevo
            setStaff(prev => {
                const existe = prev.find(u => u._id === res.usuario?._id)
                if (existe) return prev.map(u => u._id === res.usuario._id ? res.usuario : u)
                return [res.usuario ?? datos, ...prev]
            })
            setSuccess(res.msg ?? "Trabajador registrado correctamente")
            return { ok: true }
        } catch (e) {
            setError(e.message)
            return { ok: false, error: e.message }
        } finally {
            setGuardando(false)
        }
    }, [])

    // ── Editar datos o roles ──────────────────────────────────────
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

    // ── Ascender: reemplaza el rol de staff por el siguiente ────────
    const ascenderRol = useCallback(async (usuario) => {
        const rolesActuales = usuario.roles ?? [usuario.rol]
        const rolesStaff    = rolesActuales.filter(r => ROLES_STAFF.includes(r))
        const rolActual     = rolDominante(rolesStaff.length ? rolesStaff : ["trabajador"])
        const idx           = ROLES_STAFF.indexOf(rolActual)

        if (idx >= ROLES_STAFF.length - 1) {
            setError("Este usuario ya tiene el rol máximo (Administrador)")
            return { ok: false }
        }

        const nuevoRol    = ROLES_STAFF[idx + 1]
        // Quitar todos los roles de staff y poner solo el nuevo
        const sinStaff    = rolesActuales.filter(r => !ROLES_STAFF.includes(r))
        const rolesNuevos = [...sinStaff, nuevoRol]
        return editarStaff(usuario._id, { roles: rolesNuevos })
    }, [editarStaff])

    // ── Descender: reemplaza el rol de staff por el anterior ─────
    const descenderRol = useCallback(async (usuario) => {
        const rolesActuales = usuario.roles ?? [usuario.rol]
        const rolesStaff    = rolesActuales.filter(r => ROLES_STAFF.includes(r))
        const rolActual     = rolDominante(rolesStaff.length ? rolesStaff : ["trabajador"])
        const idx           = ROLES_STAFF.indexOf(rolActual)

        if (idx <= 0) {
            setError("Este usuario ya tiene el rol mínimo (Trabajador)")
            return { ok: false }
        }

        const nuevoRol    = ROLES_STAFF[idx - 1]
        // Quitar todos los roles de staff y poner solo el anterior
        const sinStaff    = rolesActuales.filter(r => !ROLES_STAFF.includes(r))
        const rolesNuevos = [...sinStaff, nuevoRol]
        return editarStaff(usuario._id, { roles: rolesNuevos })
    }, [editarStaff])

    // ── Eliminar ──────────────────────────────────────────────────
    const eliminarStaff = useCallback(async (id) => {
        try {
            setGuardando(true)
            const res = await staffService.delete(id)
            // Si el backend conservó la cuenta como cliente, actualizar en lugar de quitar
            if (res?.usuario) {
                setStaff(prev => prev.filter(u => u._id !== id))
            } else {
                setStaff(prev => prev.filter(u => u._id !== id))
            }
            setSuccess(res?.msg ?? "Trabajador eliminado correctamente")
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
        staff, loading, guardando, error, success,
        fetchStaff, crearStaff, editarStaff, ascenderRol, descenderRol, eliminarStaff, clearMessages,
    }
}