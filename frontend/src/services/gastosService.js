import { apiFetch } from "./api"

export const gastosService = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiFetch(`/api/gastos${query ? `?${query}` : ""}`)
    },
    crear:      (datos) => apiFetch("/api/gastos", { method: "POST", body: JSON.stringify(datos) }),
    actualizar: (id, datos) => apiFetch(`/api/gastos/${id}`, { method: "PUT", body: JSON.stringify(datos) }),
    toggle:     (id) => apiFetch(`/api/gastos/${id}/toggle`, { method: "PATCH" }),
    eliminar:   (id) => apiFetch(`/api/gastos/${id}`, { method: "DELETE" }),

    getResumen:      (periodo) => apiFetch(`/api/gastos/resumen?periodo=${periodo}`),
    getPorCategoria: () => apiFetch("/api/gastos/por-categoria"),
}