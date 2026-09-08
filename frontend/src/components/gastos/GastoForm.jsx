import PropTypes from "prop-types"
import { useState } from "react"
import { FiX, FiDollarSign, FiRepeat } from "react-icons/fi"

const CATEGORIAS = [
    "Servicios Básicos", "Sueldos", "Insumos", "Arriendo",
    "Mantenimiento", "Impuestos", "Marketing", "Otro",
]

const buildForm = (gasto) => ({
    concepto:  gasto?.concepto ?? "",
    monto:     gasto?.monto ?? "",
    categoria: gasto?.categoria ?? "Otro",
    tipo:      gasto?.tipo ?? "ocasional",
    fecha:     gasto?.fechaInicio
        ? new Date(gasto.fechaInicio).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
})

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

export function GastoForm({ open, gasto, guardando, onClose, onSubmit }) {
    const [form, setForm]     = useState(() => buildForm(gasto))
    const [errors, setErrors] = useState({})

    const esEdicion = !!gasto

    if (!open) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        setErrors(err => ({ ...err, [name]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.concepto.trim()) e.concepto = "El concepto es obligatorio"
        if (!form.monto || Number(form.monto) <= 0) e.monto = "El monto debe ser mayor a 0"
        if (!form.fecha) e.fecha = "Selecciona una fecha"
        return e
    }

    const handleSubmit = () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        onSubmit({
            concepto:  form.concepto.trim(),
            monto:     Number(form.monto),
            categoria: form.categoria,
            tipo:      form.tipo,
            fecha:     form.fecha,
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="font-sans font-extrabold text-lg text-slate-800">
                        {esEdicion ? "Editar Gasto" : "Nuevo Gasto"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <div className="p-6 space-y-4">

                    <Field label="Tipo de gasto *">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { valor: "ocasional", label: "Ocasional",       icon: <FiDollarSign /> },
                                { valor: "fijo",       label: "Fijo (mensual)", icon: <FiRepeat />     },
                            ].map(opt => (
                                <button
                                    key={opt.valor}
                                    type="button"
                                    disabled={esEdicion}
                                    onClick={() => setForm(f => ({ ...f, tipo: opt.valor }))}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2
                                        font-sans text-sm font-semibold transition-all
                                        ${form.tipo === opt.valor
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                                        } ${esEdicion ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>
                        {form.tipo === "fijo" && (
                            <p className="text-xs font-sans text-primary/80 mt-2">
                                Este gasto se repetirá automáticamente cada mes hasta que lo desactives.
                            </p>
                        )}
                    </Field>

                    <Field label="Concepto *" error={errors.concepto}>
                        <input name="concepto" value={form.concepto} onChange={handleChange}
                            placeholder="Ej: Sueldo barista, Luz eléctrica..." className={inputCls(errors.concepto)} />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Monto (USD) *" error={errors.monto}>
                            <input name="monto" type="number" min="0" step="0.01"
                                value={form.monto} onChange={handleChange}
                                placeholder="0.00" className={inputCls(errors.monto)} />
                        </Field>
                        <Field label={form.tipo === "fijo" ? "Día de cobro *" : "Fecha *"} error={errors.fecha}>
                            <input name="fecha" type="date" value={form.fecha} onChange={handleChange}
                                className={inputCls(errors.fecha)} />
                        </Field>
                    </div>

                    <Field label="Categoría">
                        <select name="categoria" value={form.categoria} onChange={handleChange} className={inputCls()}>
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Field>
                </div>

                <div className="flex gap-3 p-6 border-t border-slate-100">
                    <button type="button" onClick={onClose} disabled={guardando}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50">
                        Cancelar
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={guardando}
                        className="flex-1 py-2.5 rounded-xl bg-primary text-white font-sans font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                        {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar gasto"}
                    </button>
                </div>
            </div>
        </div>
    )
}

GastoForm.propTypes = {
    open:      PropTypes.bool.isRequired,
    gasto:     PropTypes.object,
    guardando: PropTypes.bool,
    onClose:   PropTypes.func.isRequired,
    onSubmit:  PropTypes.func.isRequired,
}