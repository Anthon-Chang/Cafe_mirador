import { apiFetch } from "./api"

export const pedidosService = {
    getActivos: () =>
        apiFetch("/api/pedidos/activos"),

    getTodos: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiFetch(`/api/pedidos${query ? `?${query}` : ""}`)
    },

    getEstadisticas: () =>
        apiFetch("/api/pedidos/estadisticas"),

    getAnaliticas: () =>
    apiFetch("/api/pedidos/analiticas"),

    crear: (datos) =>
        apiFetch("/api/pedidos", {
            method: "POST",
            body: JSON.stringify(datos),
        }),

    actualizarEstado: (id, estado) =>
        apiFetch(`/api/pedidos/${id}/estado`, {
            method: "PATCH",
            body: JSON.stringify({ estado }),
        }),

    actualizar: (id, datos) =>
        apiFetch(`/api/pedidos/${id}`, {
            method: "PUT",
            body: JSON.stringify(datos),
        }),

    eliminar: (id) =>
        apiFetch(`/api/pedidos/${id}`, { method: "DELETE" }),
}