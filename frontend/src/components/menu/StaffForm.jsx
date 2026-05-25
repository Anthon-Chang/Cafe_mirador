import PropTypes from "prop-types"
import { useState } from "react"
import { FiX } from "react-icons/fi"

const ROLES_STAFF = [
    "trabajador",
    "supervisor",
    "administrador"
]

const buildForm = (staff) => ({
    nombre:    staff?.nombre    ?? "",
    apellido:  staff?.apellido  ?? "",
    email:     staff?.email     ?? "",
    rol:       staff?.rol       ?? "trabajador",
    cedula:    staff?.cedula    ?? "",
    celular:   staff?.celular   ?? "",
    direccion: staff?.direccion ?? "",
})

export function StaffForm({
    open,
    staff,
    guardando,
    onClose,
    onSubmit
}) {

    const esEdicion = !!staff

    // ── State ───────────────────────────────────────────
    const [form, setForm] = useState(() => buildForm(staff))
    const [errors, setErrors] = useState({})

    if (!open) return null

    // ── Handlers ────────────────────────────────────────
    const handleChange = (e) => {

        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))

        setErrors(prev => ({
            ...prev,
            [name]: null
        }))
    }

    const validate = () => {

        const err = {}

        if (!form.nombre.trim()) {
            err.nombre = "El nombre es obligatorio"
        }

        if (!form.apellido.trim()) {
            err.apellido = "El apellido es obligatorio"
        }

        if (!esEdicion) {

            if (!form.email.trim()) {
                err.email = "El email es obligatorio"
            }

            else if (!/\S+@\S+\.\S+/.test(form.email)) {
                err.email = "Email no válido"
            }
        }

        if (!form.rol) {
            err.rol = "El rol es obligatorio"
        }

        return err
    }

    const handleSubmit = () => {

        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        // En edición no enviamos email
        const datos = esEdicion
            ? {
                nombre: form.nombre,
                apellido: form.apellido,
                rol: form.rol,
                cedula: form.cedula,
                celular: form.celular,
                direccion: form.direccion,
            }
            : form

        onSubmit(datos)
    }

    // ── Render ──────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">

                    <h2 className="font-sans font-extrabold text-lg text-slate-800">
                        {esEdicion
                            ? "Editar Trabajador"
                            : "Registrar Trabajador"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FiX className="text-xl" />
                    </button>

                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    {/* Aviso */}
                    {!esEdicion && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">

                            <p className="text-xs font-sans text-primary font-medium">
                                💡 Se generará una contraseña automática y se enviará al correo del trabajador.
                            </p>

                        </div>
                    )}

                    {/* Nombre + Apellido */}
                    <div className="grid grid-cols-2 gap-4">

                        <Field
                            label="Nombre *"
                            error={errors.nombre}
                        >

                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Juan"
                                className={inputCls(errors.nombre)}
                            />

                        </Field>

                        <Field
                            label="Apellido *"
                            error={errors.apellido}
                        >

                            <input
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                placeholder="Pérez"
                                className={inputCls(errors.apellido)}
                            />

                        </Field>

                    </div>

                    {/* Email */}
                    {!esEdicion && (
                        <Field
                            label="Email *"
                            error={errors.email}
                        >

                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="juan@cafemirador.com"
                                className={inputCls(errors.email)}
                            />

                        </Field>
                    )}

                    {/* Rol */}
                    <Field
                        label="Rol *"
                        error={errors.rol}
                    >

                        <select
                            name="rol"
                            value={form.rol}
                            onChange={handleChange}
                            className={inputCls(errors.rol)}
                        >

                            {ROLES_STAFF.map(rol => (
                                <option
                                    key={rol}
                                    value={rol}
                                >
                                    {rol.charAt(0).toUpperCase() + rol.slice(1)}
                                </option>
                            ))}

                        </select>

                    </Field>

                    {/* Datos opcionales */}
                    <div className="pt-2 border-t border-slate-100">

                        <p className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-3">
                            Datos adicionales (opcional)
                        </p>

                        <div className="space-y-4">

                            <Field label="Cédula">

                                <input
                                    name="cedula"
                                    value={form.cedula}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    className={inputCls()}
                                />

                            </Field>

                            <div className="grid grid-cols-2 gap-4">

                                <Field label="Celular">

                                    <input
                                        name="celular"
                                        value={form.celular}
                                        onChange={handleChange}
                                        placeholder="0991234567"
                                        className={inputCls()}
                                    />

                                </Field>

                                <Field label="Dirección">

                                    <input
                                        name="direccion"
                                        value={form.direccion}
                                        onChange={handleChange}
                                        placeholder="Ciudad, calle..."
                                        className={inputCls()}
                                    />

                                </Field>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-100">

                    <button
                        onClick={onClose}
                        disabled={guardando}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={guardando}
                        className="flex-1 py-2.5 rounded-xl bg-primary text-white font-sans font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {guardando
                            ? "Guardando..."
                            : esEdicion
                                ? "Guardar cambios"
                                : "Registrar"}
                    </button>

                </div>

            </div>

        </div>
    )
}

// ── Components ────────────────────────────────────────────
function Field({
    label,
    error,
    children
}) {

    return (
        <div>

            <label className="block text-xs font-sans font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                {label}
            </label>

            {children}

            {error && (
                <p className="text-xs text-red-500 mt-1">
                    {error}
                </p>
            )}

        </div>
    )
}

// ── Styles ────────────────────────────────────────────────
const inputCls = (err) => `
    w-full px-3.5 py-2.5 rounded-xl border
    font-sans text-sm text-slate-800 bg-white
    outline-none transition-colors

    ${
        err
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
    }
`

// ── PropTypes ─────────────────────────────────────────────
Field.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    children: PropTypes.node.isRequired,
}

StaffForm.propTypes = {
    open: PropTypes.bool.isRequired,
    staff: PropTypes.object,
    guardando: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}