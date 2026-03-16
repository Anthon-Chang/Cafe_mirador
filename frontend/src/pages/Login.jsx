import { useState } from "react"
import { Link } from "react-router-dom"
import { FiCoffee, FiLock, FiEye, FiEyeOff, FiMail } from "react-icons/fi"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData]         = useState({ email: "", password: "", remember: false })
    const [loading, setLoading]           = useState(false)
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // TODO: conectar con tu API de autenticación
        console.log("Login data:", formData)
        setTimeout(() => setLoading(false), 1500)
    }

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

        {/* ── LADO DERECHO: formulario ───────────────────────────────── */}
        <div className="flex flex-col w-full lg:w-1/2 justify-center items-center p-6 sm:p-12 md:p-20 bg-[#f5f8f8]">

            {/* Banner móvil */}
            <div className="lg:hidden w-full h-48 rounded-2xl mb-8 overflow-hidden relative">
            <img
                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80"
                alt="Latte art"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Card */}
            <div className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-primary/5 border border-[#e5edee]">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-primary/10 p-3 rounded-xl mb-3">
                <FiCoffee className="text-primary text-4xl" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#101818]">Bienvenido de vuelta</h2>
                <p className="text-sm text-[#5e8a8d] mt-1">Ingresa tus datos para iniciar sesión</p>
            </div>

            {/* Formulario */}
            <form className="space-y-5" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#101818] ml-1" htmlFor="email">
                    Correo electrónico
                </label>
                <div className="relative flex items-center group">
                    <FiMail className="absolute left-4 text-[#5e8a8d] group-focus-within:text-primary transition-colors" />
                    <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f5f8f8] border border-[#dae6e7] rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-[#101818] placeholder:text-[#5e8a8d]/60"
                    />
                </div>
                </div>

                {/* Contraseña */}
                <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#101818] ml-1" htmlFor="password">
                    Contraseña
                </label>
                <div className="relative flex items-center group">
                    <FiLock className="absolute left-4 text-[#5e8a8d] group-focus-within:text-primary transition-colors" />
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-[#f5f8f8] border border-[#dae6e7] rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-[#101818] placeholder:text-[#5e8a8d]/60"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#5e8a8d] hover:text-primary transition-colors">
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
                </div>

                {/* Recordar / Olvidé */}
                <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-[#dae6e7] text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <span className="text-[#5e8a8d]">Recuérdame</span>
                </label>
                <a href="#" className="text-primary font-semibold hover:underline">
                    ¿Olvidaste tu contraseña?
                </a>
                </div>

                {/* Botón submit */}
                <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-[#009299] text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Ingresando..." : "Iniciar Sesión"}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#dae6e7]" />
                <span className="flex-shrink mx-4 text-xs font-medium text-[#5e8a8d] uppercase tracking-wider">
                    O continúa con
                </span>
                <div className="flex-grow border-t border-[#dae6e7]" />
                </div>

                {/* Google */}
                <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3.5 border border-[#dae6e7] bg-white rounded-lg hover:bg-[#f5f8f8] transition-all text-[#101818] font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
                </button>
            </form>

            {/* Footer card */}
            <div className="mt-8 text-center">
                <p className="text-sm text-[#5e8a8d]">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-secondary font-bold hover:underline ml-1">
                    Regístrate
                </Link>
                </p>
            </div>
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