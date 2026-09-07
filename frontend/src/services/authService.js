// frontend/src/services/authService.js
import { apiFetch } from "./api"

export const authService = {
    login: (email, password) =>
        apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

    registerUser: (userData) =>
        apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(userData) }),

    getPerfil: () => apiFetch("/api/user/perfil"),

    // 🆕
    updatePerfil: (datos) =>
        apiFetch("/api/user/perfil", { method: "PUT", body: JSON.stringify(datos) }),

    cambiarPassword: (datos) =>
        apiFetch("/api/user/perfil/password", { method: "PUT", body: JSON.stringify(datos) }),

    logout: () => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
    },
}

export default authService;