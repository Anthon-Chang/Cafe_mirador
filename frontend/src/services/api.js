import { API_URL } from "../utils/constants"

// Lee el token desde cualquiera de los dos storages
const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token")

// Construye los headers con el token activo
export const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
})

// Wrapper de fetch con manejo de errores centralizado
export const apiFetch = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...authHeaders(),
            ...options.headers,
        },
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.msg || `Error ${res.status}`)
    }

    return data
}