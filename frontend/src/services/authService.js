const API_URL = import.meta.env.VITE_API_URL

// ── LOGIN ─────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.msg || "Error al iniciar sesión")
    return data
}

// ── REGISTRO MANUAL ───────────────────────────────────
export const registerUser = async (formData) => {
    const partes   = formData.nombre.trim().split(" ")
    const nombre   = partes[0]
    const apellido = partes.slice(1).join(" ") || "."

    const response = await fetch(`${API_URL}/api/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre,
            apellido,
            email:     formData.email,
            password:  formData.password,
            cedula:    formData.cedula,
            celular:   formData.celular,
            direccion: formData.direccion,
        }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.msg || "Error al registrarse")
    return data
}