import PropTypes from "prop-types"
import { useState, useMemo } from "react"
import { FiX } from "react-icons/fi"
import { RolesBadges } from "../ui/RolBadge"

const ROLES_STAFF = ["trabajador", "supervisor", "administrador"]
const INITIAL = { nombre: "", apellido: "", email: "", rol: "trabajador", cedula: "", celular: "", direccion: "" }

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-sans font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}
Field.propTypes = { label: PropTypes.string.isRequired, error: PropTypes.string, children: PropTypes.node.isRequired }

const inputCls = (err) =>
    `w-full px-3.5 py-2.5 rounded-xl border font-sans text-sm text-slate-800 bg-white outline-none transition-colors
     ${err ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
           : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10"}`

/** Calcula el estado inicial del formulario a partir del staff recibido */
function buildInitialForm(staff) {
    if (!staff) return INITIAL
    const roles    = staff.roles ?? [staff.rol]
    const rolStaff = roles.filter(r => ROLES_STAFF.includes(r))[0] ?? "trabajador"
    return {
        nombre:    staff.nombre    ?? "",
        apellido:  staff.apellido  ?? "",
        email:     staff.email     ?? "",
        rol:       rolStaff,
        cedula:    staff.cedula    ?? "",
        celular:   staff.celular   ?? "",
        direccion: staff.direccion ?? "",
    }
}

export function StaffForm({ open, staff, guardando, onClose, onSubmit }) {
    // Recalcula el valor inicial cada vez que cambia `staff` o se abre el modal
    const initialForm = useMemo(() => buildInitialForm(staff), [staff, open]) // eslint-disable-line react-hooks/exhaustive-deps

    const [form, setForm]     = useState(initialForm)
    const [errors, setErrors] = useState({})

    // Sincronizar cuando el modal se abre con datos distintos
    // usando key en el componente padre (ver nota abajo) o re-inicializando aquí
    // sin useEffect: comparamos con una ref
    const esEdicion = !!staff

    if (!open) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        setErrors(err => ({ ...err, [name]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.nombre.trim())   e.nombre  = "El nombre es obligatorio"
        if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio"
        if (!esEdicion) {
            if (!form.email.trim()) e.email = "El email es obligatorio"
            else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email no válido"
        }
        if (!form.rol) e.rol = "El rol es obligatorio"
        return e
    }

    const handleSubmit = () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        if (esEdicion) {
            const rolesActuales = staff.roles ?? [staff.rol]
            const sinStaff      = rolesActuales.filter(r => !ROLES_STAFF.includes(r))
            const rolesNuevos   = [...new Set([...sinStaff, form.rol])]
            onSubmit({ nombre: form.nombre, apellido: form.apellido, roles: rolesNuevos, cedula: form.cedula, celular: form.celular, direccion: form.direccion })
        } else {
            onSubmit({ ...form })
        }
    }

    const rolesActuales    = staff ? (staff.roles ?? [staff.rol]) : []
    const esClienteTambien = rolesActuales.includes("cliente")

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="font-sans font-extrabold text-lg text-slate-800">
                        {esEdicion ? "Editar Trabajador" : "Registrar Trabajador"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    {!esEdicion && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-1">
                            <p className="text-xs font-sans text-primary font-semibold">
                                💡 ¿El usuario ya tiene cuenta como cliente?
                            </p>
                            <p className="text-xs font-sans text-primary/80">
                                Si el email ya está registrado se añadirá el rol de trabajador a su cuenta
                                existente sin perder su historial. Si es nuevo, se creará la cuenta y se
                                enviarán las credenciales por correo.
                            </p>
                        </div>
                    )}

                    {esEdicion && esClienteTambien && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                            <p className="text-xs font-sans text-green-700 font-semibold mb-1.5">
                                👤 Usuario con múltiples roles
                            </p>
                            <RolesBadges roles={rolesActuales} />
                            <p className="text-xs font-sans text-green-600 mt-2">
                                Al cambiar el rol de staff no se eliminará su registro como cliente.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Nombre *" error={errors.nombre}>
                            <input name="nombre" value={form.nombre} onChange={handleChange}
                                placeholder="Juan" className={inputCls(errors.nombre)} />
                        </Field>
                        <Field label="Apellido *" error={errors.apellido}>
                            <input name="apellido" value={form.apellido} onChange={handleChange}
                                placeholder="Pérez" className={inputCls(errors.apellido)} />
                        </Field>
                    </div>

                    {!esEdicion && (
                        <Field label="Email *" error={errors.email}>
                            <input name="email" type="email" value={form.email} onChange={handleChange}
                                placeholder="juan@cafemirador.com" className={inputCls(errors.email)} />
                        </Field>
                    )}

                    <Field label="Rol de Staff *" error={errors.rol}>
                        <select name="rol" value={form.rol} onChange={handleChange} className={inputCls(errors.rol)}>
                            {ROLES_STAFF.map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                    </Field>

                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-3">
                            Datos adicionales (opcional)
                        </p>
                        <div className="space-y-4">
                            <Field label="Cédula">
                                <input name="cedula" value={form.cedula} onChange={handleChange}
                                    placeholder="1234567890" className={inputCls()} />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Celular">
                                    <input name="celular" value={form.celular} onChange={handleChange}
                                        placeholder="0991234567" className={inputCls()} />
                                </Field>
                                <Field label="Dirección">
                                    <input name="direccion" value={form.direccion} onChange={handleChange}
                                        placeholder="Ciudad, calle..." className={inputCls()} />
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-100">
                    <button type="button" onClick={onClose} disabled={guardando}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50">
                        Cancelar
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={guardando}
                        className="flex-1 py-2.5 rounded-xl bg-primary text-white font-sans font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                        {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar"}
                    </button>
                </div>
            </div>
        </div>
    )
}

StaffForm.propTypes = {
    open:      PropTypes.bool.isRequired,
    staff:     PropTypes.object,
    guardando: PropTypes.bool,
    onClose:   PropTypes.func.isRequired,
    onSubmit:  PropTypes.func.isRequired,
}