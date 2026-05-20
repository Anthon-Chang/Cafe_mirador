import PropTypes from "prop-types"
import { useState, useEffect, useCallback } from "react"
import { AuthContext } from "./AuthContext"
import { authService } from "../services/authService"

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    const cargarPerfil = useCallback(async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        if (!token) { setLoading(false); return }

        try {
            const data = await authService.getPerfil()
            setUsuario(data)
        } catch {
            authService.logout()
            setUsuario(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { cargarPerfil() }, [cargarPerfil])

    const login = async (email, password, recordar = false) => {
        const data = await authService.login(email, password)
        const storage = recordar ? localStorage : sessionStorage
        storage.setItem("token", data.token)
        setUsuario(data.usuario)
        return data
    }

    const logout = (navigate) => {
        authService.logout()
        setUsuario(null)
        navigate?.("/login")
    }

    return (
        <AuthContext.Provider value={{ usuario, loading, login, logout, cargarPerfil }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}