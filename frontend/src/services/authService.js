import { apiFetch } from "./api"

export const authService = {
    login: (email, password) =>
        apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    // Añadimos el método que le hace falta a tu formulario de registro
    registerUser: (userData) =>
        apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        }),

    getPerfil: () =>
        apiFetch("/api/user/perfil"),

    logout: () => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
    },
}

// Lo exportamos por defecto para quitar las llaves molestas al importar
export default authService;