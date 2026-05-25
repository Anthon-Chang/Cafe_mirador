import { apiFetch } from "./api"

// ── STAFF (Trabajadores) ─────────────────────────────────────────────
export const staffService = {
    /** Obtener todos los usuarios staff */
    getAll: () => apiFetch("/api/user/staff"),

    /** Registrar un nuevo trabajador */
    create: (datos) =>
        apiFetch("/api/user/staff", {
            method: "POST",
            body: JSON.stringify(datos),
        }),

    /** Editar datos o rol de un trabajador */
    update: (id, datos) =>
        apiFetch(`/api/user/staff/${id}`, {
            method: "PUT",
            body: JSON.stringify(datos),
        }),

    /** Eliminar trabajador */
    delete: (id) =>
        apiFetch(`/api/user/staff/${id}`, { method: "DELETE" }),
}

// ── PRODUCTOS ────────────────────────────────────────────────────────
export const productosService = {
    /** Listar todos los productos */
    getAll: () => apiFetch("/api/productos"),

    /** Obtener detalle de un producto */
    getById: (id) => apiFetch(`/api/productos/${id}`),

    /** Crear producto (con imagen base64 opcional) */
    create: (datos) =>
        apiFetch("/api/productos", {
            method: "POST",
            body: JSON.stringify(datos),
        }),

    /** Actualizar producto */
    update: (id, datos) =>
        apiFetch(`/api/productos/${id}`, {
            method: "PUT",
            body: JSON.stringify(datos),
        }),

    /** Eliminar producto */
    delete: (id) =>
        apiFetch(`/api/productos/${id}`, { method: "DELETE" }),
}