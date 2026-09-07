// frontend/src/pages/admin/PerfilPage.jsx
import PropTypes from "prop-types"
import { useState, useRef } from "react"
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiHash, FiCamera,
    FiLock, FiEye, FiEyeOff, FiSave, FiRefreshCw, FiShield
} from "react-icons/fi"
import { useAuth }        from "../../context/useAuth"
import { authService }    from "../../services/authService"
import { RolesBadges }    from "../../components/ui/RolBadge"
import { Toast }          from "../../components/ui/Toast"
import { formatFecha }    from "../../utils/formatters"

// ─── Utilidades ──────────────────────────────────────────────────────────────
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const buildForm = (usuario) => ({
    nombre:    usuario?.nombre    ?? "",
    apellido:  usuario?.apellido  ?? "",
    celular:   usuario?.celular   ?? "",
    direccion: usuario?.direccion ?? "",
})

const inputCls = (err) =>
    `w-full pl-11 pr-4 h-12 rounded-xl border font-sans text-sm text-slate-800
     bg-white outline-none transition-colors
     ${err ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
           : "border-[#dbe6e6] focus:border-primary focus:ring-2 focus:ring-primary/10"}`

// ─── Campo con ícono ──────────────────────────────────────────────────────────
function Field({ label, error, icon, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {label}
            </span>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    {icon}
                </span>
                {children}
            </div>
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </label>
    )
}
Field.propTypes = {
    label:    PropTypes.string.isRequired,
    error:    PropTypes.string,
    icon:     PropTypes.node,
    children: PropTypes.node.isRequired,
}

// ─── Formulario (se re-crea cuando cambia el usuario, vía key en el padre) ────
function PerfilForm({ usuario, onGuardado }) {
    // Datos personales
    const [form, setForm]           = useState(() => buildForm(usuario))
    const [errors, setErrors]       = useState({})
    const [guardando, setGuardando] = useState(false)

    // Avatar
    const [preview, setPreview]           = useState(usuario?.avatar ?? null)
    const [avatarBase64, setAvatarBase64] = useState("")
    const fileRef = useRef()

    // Contraseña
    const [pwd, setPwd]             = useState({ actual: "", nueva: "" })
    const [showPwd, setShowPwd]     = useState({ actual: false, nueva: false })
    const [pwdErrors, setPwdErrors] = useState({})
    const [guardandoPwd, setGuardandoPwd] = useState(false)

    // Toast
    const [toast, setToast] = useState({ type: "success", message: "" })
    const showToast = (type, message) => setToast({ type, message })

    // ── Handlers datos personales ───────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        setErrors(err => ({ ...err, [name]: null }))
    }

    const handleAvatar = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const base64 = await fileToBase64(file)
        setPreview(base64)
        setAvatarBase64(base64)
    }

    const validate = () => {
        const e = {}
        if (!form.nombre.trim())   e.nombre   = "El nombre es obligatorio"
        if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio"
        return e
    }

    const handleGuardar = async () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        try {
            setGuardando(true)
            const payload = { ...form }
            if (avatarBase64) payload.avatarBase64 = avatarBase64

            const res = await authService.updatePerfil(payload)
            onGuardado(res.usuario)
            setAvatarBase64("")
            showToast("success", "Perfil actualizado correctamente")
        } catch (err) {
            showToast("error", err.message || "No se pudo actualizar el perfil")
        } finally {
            setGuardando(false)
        }
    }

    // ── Handlers contraseña ─────────────────────────────────────────────────
    const handlePwdChange = (key, value) => {
        setPwd(p => ({ ...p, [key]: value }))
        setPwdErrors(err => ({ ...err, [key]: null }))
    }

    const validatePwd = () => {
        const e = {}
        if (!pwd.actual) e.actual = "Ingresa tu contraseña actual"
        if (!pwd.nueva) e.nueva = "Ingresa una nueva contraseña"
        else if (pwd.nueva.length < 6) e.nueva = "Debe tener al menos 6 caracteres"
        return e
    }

    const handleCambiarPassword = async () => {
        const errs = validatePwd()
        if (Object.keys(errs).length) { setPwdErrors(errs); return }

        try {
            setGuardandoPwd(true)
            await authService.cambiarPassword({
                passwordActual:    pwd.actual,
                passwordNueva:     pwd.nueva,
                confirmarPassword: pwd.nueva, // el backend sigue esperando este campo; lo llenamos automáticamente
            })
            setPwd({ actual: "", nueva: "" })
            setPwdErrors({})
            showToast("success", "Contraseña actualizada correctamente")
        } catch (err) {
            showToast("error", err.message || "No se pudo cambiar la contraseña")
        } finally {
            setGuardandoPwd(false)
        }
    }

    const roles = usuario.roles ?? [usuario.rol]

    return (
        <div className="space-y-6">
            <Toast type={toast.type} message={toast.message}
                   onClose={() => setToast(p => ({ ...p, message: "" }))} />

            <div>
                <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-800">
                    Mi Perfil
                </h1>
                <p className="font-sans text-sm text-slate-400 mt-1">
                    Administra tu foto, tus datos y tu contraseña.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Columna izquierda: avatar + resumen ── */}
                <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm p-6
                                flex flex-col items-center text-center h-fit">
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="relative w-28 h-28 rounded-full cursor-pointer group overflow-hidden
                                   border-4 border-white shadow-md bg-primary/10 flex items-center
                                   justify-center shrink-0"
                    >
                        {preview ? (
                            <img src={preview} alt="Foto de perfil" className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="text-4xl text-primary/60" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                                        transition-colors flex items-center justify-center">
                            <FiCamera className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                    <p className="font-sans text-xs text-slate-400 mt-2">Click en la foto para cambiarla</p>

                    <h2 className="font-sans font-extrabold text-lg text-slate-800 mt-4">
                        {usuario.nombre} {usuario.apellido}
                    </h2>
                    <p className="font-sans text-sm text-slate-400 mb-3 break-all">{usuario.email}</p>

                    <RolesBadges roles={roles} />

                    {usuario.createdAt && (
                        <p className="font-sans text-xs text-slate-400 mt-4 pt-4 border-t border-[#dbe6e6] w-full">
                            Miembro desde {formatFecha(usuario.createdAt)}
                        </p>
                    )}
                </div>

                {/* ── Columna derecha: formularios ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Datos personales */}
                    <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm p-6">
                        <h3 className="font-sans font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                            <FiUser className="text-primary" /> Datos personales
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Nombre" error={errors.nombre} icon={<FiUser />}>
                                <input name="nombre" value={form.nombre} onChange={handleChange}
                                    placeholder="Tu nombre" className={inputCls(errors.nombre)} />
                            </Field>
                            <Field label="Apellido" error={errors.apellido} icon={<FiUser />}>
                                <input name="apellido" value={form.apellido} onChange={handleChange}
                                    placeholder="Tu apellido" className={inputCls(errors.apellido)} />
                            </Field>
                            <Field label="Email" icon={<FiMail />}>
                                <input value={usuario.email} disabled
                                    className={inputCls() + " opacity-60 cursor-not-allowed"} />
                            </Field>
                            <Field label="Cédula" icon={<FiHash />}>
                                <input value={usuario.cedula ?? "—"} disabled
                                    className={inputCls() + " opacity-60 cursor-not-allowed"} />
                            </Field>
                            <Field label="Celular" icon={<FiPhone />}>
                                <input name="celular" value={form.celular} onChange={handleChange}
                                    placeholder="+593 99 000 0000" className={inputCls()} />
                            </Field>
                            <Field label="Dirección" icon={<FiMapPin />}>
                                <input name="direccion" value={form.direccion} onChange={handleChange}
                                    placeholder="Ciudad, calle..." className={inputCls()} />
                            </Field>
                        </div>

                        <div className="flex justify-end mt-5">
                            <button onClick={handleGuardar} disabled={guardando}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white
                                           font-sans font-semibold text-sm hover:bg-primary/90 transition-colors
                                           disabled:opacity-50">
                                {guardando
                                    ? <><FiRefreshCw className="animate-spin text-sm" /> Guardando...</>
                                    : <><FiSave className="text-sm" /> Guardar cambios</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Seguridad */}
                    <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm p-6">
                        <h3 className="font-sans font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                            <FiShield className="text-primary" /> Seguridad
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: "actual", label: "Contraseña actual" },
                                { key: "nueva",  label: "Nueva contraseña"  },
                            ].map(({ key, label }) => (
                                <Field key={key} label={label} error={pwdErrors[key]} icon={<FiLock />}>
                                    <input
                                        type={showPwd[key] ? "text" : "password"}
                                        value={pwd[key]}
                                        onChange={e => handlePwdChange(key, e.target.value)}
                                        placeholder="••••••••"
                                        className={inputCls(pwdErrors[key]) + " pr-11"}
                                    />
                                    <button type="button"
                                        onClick={() => setShowPwd(s => ({ ...s, [key]: !s[key] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                                                hover:text-primary transition-colors">
                                        {/* Ojo abierto = contraseña visible ahora · Ojo tachado = contraseña oculta ahora */}
                                        {showPwd[key] ? <FiEye className="text-sm" /> : <FiEyeOff className="text-sm" />}
                                    </button>
                                </Field>
                            ))}
                        </div>

                        <div className="flex justify-end mt-5">
                            <button onClick={handleCambiarPassword} disabled={guardandoPwd}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/40
                                        text-primary font-sans font-semibold text-sm hover:bg-primary/5
                                        transition-colors disabled:opacity-50">
                                {guardandoPwd
                                    ? <><FiRefreshCw className="animate-spin text-sm" /> Actualizando...</>
                                    : <><FiLock className="text-sm" /> Cambiar contraseña</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

PerfilForm.propTypes = {
    usuario:    PropTypes.object.isRequired,
    onGuardado: PropTypes.func.isRequired,
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function PerfilPage() {
    const { usuario, loading, actualizarUsuario } = useAuth()

    if (loading || !usuario) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <FiRefreshCw className="text-3xl text-slate-300 animate-spin" />
                <p className="font-sans text-sm text-slate-400">Cargando perfil...</p>
            </div>
        )
    }

    // key={usuario._id} → mismo patrón de remount que ModalEditar en GestionPedidosPage
    return <PerfilForm key={usuario._id} usuario={usuario} onGuardado={actualizarUsuario} />
}

export default PerfilPage