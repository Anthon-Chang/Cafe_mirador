import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export function ConfirmEmail() {
    const { token } = useParams()
    const [estado,  setEstado]  = useState("cargando") // "cargando" | "exito" | "error"
    const [mensaje, setMensaje] = useState("")

    useEffect(() => {
        const confirmar = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/confirmar/${token}`
                )
                const data = await response.json()

                if (!response.ok) {
                    setMensaje(data.msg || "Token inválido o ya confirmado")
                    setEstado("error")
                } else {
                    setMensaje(data.msg) // "Cuenta confirmada correctamente"
                    setEstado("exito")
                }
            } catch {
                setMensaje("Error al conectar con el servidor")
                setEstado("error")
            }
        }

        confirmar()
    }, [token])

    return (
        <div className="flex min-h-screen w-full">

            {/* ── LADO IZQUIERDO: imagen (solo desktop) ─────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80"
                    alt="Interior acogedor de cafetería moderna"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-12 left-12 z-20 max-w-md text-white">
                    <h1 className="font-serif text-4xl font-bold leading-tight mb-4">
                        Creando momentos, una taza a la vez.
                    </h1>
                    <p className="text-lg opacity-90">
                        Experimenta el mejor café artesanal en un espacio diseñado para tu comodidad.
                    </p>
                </div>
            </div>

            {/* ── LADO DERECHO: contenido ────────────────────────────────── */}
            <div className="flex flex-col w-full lg:w-1/2 justify-center items-center p-6 sm:p-12 md:p-20 bg-[#f5f8f8]">

                {/* Banner móvil */}
                <div className="lg:hidden w-full h-48 rounded-2xl mb-8 overflow-hidden relative">
                    <img
                        src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80"
                        alt="Latte art"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>

                {/* Card */}
                <div className="w-full max-w-110 bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-primary/5 border border-[#e5edee] text-center">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/images/nombre.png"
                            alt="Café Mirador"
                            className="h-14 w-auto object-contain"
                        />
                    </div>

                    {/* ── CARGANDO ── */}
                    {estado === "cargando" && (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <p className="text-[#5e8a8d] text-lg font-medium">Confirmando tu cuenta...</p>
                        </div>
                    )}

                    {/* ── ÉXITO ── */}
                    {estado === "exito" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-green-50 p-4 rounded-full">
                                <svg className="w-14 h-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#101818]">¡Cuenta confirmada!</h2>
                            <p className="text-[#5e8a8d]">{mensaje}</p>
                            <p className="text-[#5e8a8d] text-sm">Ya puedes iniciar sesión y disfrutar de todos nuestros beneficios.</p>
                            <Link
                                to="/login"
                                className="mt-2 w-full py-4 bg-primary hover:bg-[#009299] text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}

                    {/* ── ERROR ── */}
                    {estado === "error" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-red-50 p-4 rounded-full">
                                <svg className="w-14 h-14 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#101818]">Algo salió mal</h2>
                            <p className="text-red-500 text-sm">{mensaje}</p>
                            <Link
                                to="/register"
                                className="mt-2 w-full py-4 bg-primary hover:bg-[#009299] text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                Volver al Registro
                            </Link>
                        </div>
                    )}
                </div>

                {/* Links footer */}
                <div className="mt-10 flex gap-6 text-xs text-[#5e8a8d]">
                    <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
                    <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
                    <a href="#" className="hover:text-primary transition-colors">Soporte</a>
                </div>
            </div>
        </div>
    )
}