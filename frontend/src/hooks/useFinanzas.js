import { useState, useEffect, useCallback } from "react"
import { gastosService } from "../services/gastosService"

export function useFinanzas() {
    const [periodo, setPeriodo] = useState("dia")
    const [datos, setDatos]     = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    const cargar = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await gastosService.getResumen(periodo)
            setDatos(res.datos)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [periodo])

    useEffect(() => { cargar() }, [cargar])

    return { periodo, setPeriodo, datos, loading, error, recargar: cargar }
}