import { useState } from "react"
import { Link } from "react-router-dom"
import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi"
import { registerUser } from "../services/authService"

export function Register() {
    const [showPassword,        setShowPassword]        = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading,             setLoading]             = useState(false)
    const [error,               setError]               = useState("")
    const [success,             setSuccess]             = useState("")
    const [formData,            setFormData]            = useState({
        nombre:          "",
        email:           "",
        cedula:          "",
        celular:         "",
        direccion:       "",
        password:        "",
        confirmPassword: "",
        terms:           false,
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        setLoading(true)

        try {
            const data = await registerUser(formData)
            setSuccess(data.msg) // "Revisa tu correo para confirmar tu cuenta"

            // Limpiar formulario tras registro exitoso
            setFormData({
                nombre:          "",
                email:           "",
                cedula:          "",
                celular:         "",
                direccion:       "",
                password:        "",
                confirmPassword: "",
                terms:           false,
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputClass =
        "w-full rounded-xl border border-[#dbe6e6] bg-white h-14 px-4 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-[#111818] placeholder:text-[#608a89]/60"

    return (
        <div className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-x-hidden">

            {/* ── LADO IZQUIERDO: imagen ───────────────────────────────── */}
            <div className="relative w-full lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80"
                    alt="Latte art en taza de cerámica"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 lg:bg-black/30" />
                <div className="absolute bottom-8 left-8 hidden lg:block max-w-sm">
                    <p className="text-white text-2xl font-serif italic leading-snug">
                        {'"El café perfecto empieza con una comunidad perfecta."'}
                    </p>
                </div>
            </div>

            {/* ── LADO DERECHO: formulario ─────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-20 bg-[#f5f8f8]">
                <div className="w-full max-w-120 space-y-8">

                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-primary mb-2">
                            Crear Cuenta
                        </h1>
                        <p className="text-[#608a89] text-lg">
                            Únete a nuestra comunidad de amantes del café.
                        </p>
                    </div>

                    {/* Mensaje de éxito */}
                    {success && (
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                            <FiCheckCircle size={22} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">¡Registro exitoso!</p>
                                <p className="text-sm mt-0.5">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Formulario */}
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Nombre completo */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#111818] ml-1">
                                Nombre Completo
                            </label>
                            <input
                                name="nombre" type="text"
                                placeholder="Ingresa tu Nombre y Apellido"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#111818] ml-1">
                                Correo Electrónico
                            </label>
                            <input
                                name="email" type="email"
                                placeholder="Ingresa tu Correo Electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Cédula + Celular (fila) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-[#111818] ml-1">Cédula</label>
                                <input
                                    name="cedula" type="text"
                                    placeholder="Ingresa tu Cédula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    required
                                    maxLength={10}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-[#111818] ml-1">Celular</label>
                                <input
                                    name="celular" type="tel"
                                    placeholder="Ingresa tu Celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    required
                                    maxLength={10}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#111818] ml-1">Dirección</label>
                            <input
                                name="direccion" type="text"
                                placeholder="Ingresa tu Dirección de Domicilio"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#111818] ml-1">Contraseña</label>
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={inputClass + " pr-12"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-[#608a89] hover:text-primary transition-colors">
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#111818] ml-1">
                                Confirmar Contraseña
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={inputClass + " pr-12"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 text-[#608a89] hover:text-primary transition-colors">
                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Términos */}
                        <div className="flex items-center gap-3 px-1 py-2">
                            <input
                                id="terms" name="terms" type="checkbox"
                                checked={formData.terms}
                                onChange={handleChange}
                                required
                                className="h-5 w-5 rounded border-[#dbe6e6] text-primary focus:ring-primary cursor-pointer accent-primary"
                            />
                            <label htmlFor="terms" className="text-sm text-[#608a89] cursor-pointer">
                                Acepto los{" "}
                                <span className="text-primary font-medium hover:underline cursor-pointer">
                                    Términos y Condiciones
                                </span>
                            </label>
                        </div>

                        {/* Botón submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-[#09a39e] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-6 border-t border-[#dbe6e6]">
                        <p className="text-[#608a89] font-medium">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-secondary font-bold ml-1 hover:underline transition-colors">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Decoración de fondo */}
            <div className="fixed top-0 right-0 p-8 pointer-events-none opacity-10">
                <svg fill="none" height="200" viewBox="0 0 100 100" width="200" className="text-primary">
                    <path d="M50 10C30 10 10 30 10 50C10 70 30 90 50 90C70 90 90 70 90 50C90 30 70 10 50 10ZM50 80C33.4 80 20 66.6 20 50C20 33.4 33.4 20 50 20C66.6 20 80 33.4 80 50C80 66.6 66.6 80 50 80Z" fill="currentColor"/>
                    <path d="M50 30C39 30 30 39 30 50C30 61 39 70 50 70C61 70 70 61 70 50C70 39 61 30 50 30Z" fill="currentColor"/>
                </svg>
            </div>
        </div>
    )
}