import PropTypes from "prop-types"
import { useState, useRef } from "react"
import { FiX, FiUpload, FiImage } from "react-icons/fi"

const CATEGORIAS = [
    "Bebidas",
    "Comidas",
    "Tradicionales",
    "Heladeria",
    "Postres",
    "Snacks",
    "Otro"
]

const buildForm = (producto) => ({
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    precio: producto?.precio ?? "",
    categoria: producto?.categoria ?? "",
    disponible: producto?.disponible ?? true,
    imagenBase64: "",
})

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => resolve(reader.result)
        reader.onerror = reject

        reader.readAsDataURL(file)
    })
}

export function ProductoForm({
    open,
    producto,
    guardando,
    onClose,
    onSubmit
}) {

    // ── States ─────────────────────────────────────────────
    const [form, setForm] = useState(() => buildForm(producto))
    const [preview, setPreview] = useState(producto?.imagen ?? null)
    const [errors, setErrors] = useState({})

    const fileRef = useRef()

    if (!open) return null

    // ── Handlers ───────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value
        }))

        setErrors(prev => ({
            ...prev,
            [name]: null
        }))
    }

    const handleImage = async (e) => {
        const file = e.target.files?.[0]

        if (!file) return

        const base64 = await fileToBase64(file)

        setPreview(base64)

        setForm(prev => ({
            ...prev,
            imagenBase64: base64
        }))
    }

    const validate = () => {
        const err = {}

        if (!form.nombre.trim()) {
            err.nombre = "El nombre es obligatorio"
        }

        if (!form.precio) {
            err.precio = "El precio es obligatorio"
        }

        if (Number(form.precio) <= 0) {
            err.precio = "El precio debe ser mayor a 0"
        }

        if (!form.categoria) {
            err.categoria = "Selecciona una categoría"
        }

        return err
    }

    const handleSubmit = () => {
        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        onSubmit({
            ...form,
            precio: Number(form.precio)
        })
    }

    // ── Render ─────────────────────────────────────────────
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
                        {producto
                            ? "Editar Producto"
                            : "Nuevo Producto"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FiX className="text-xl" />
                    </button>

                </div>

                {/* Body */}
                <div className="p-6 space-y-5">

                    {/* Imagen */}
                    <div>

                        <label className="block text-xs font-sans font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Imagen del producto
                        </label>

                        <div
                            onClick={() => fileRef.current?.click()}
                            className="relative w-full h-40 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-slate-50 flex items-center justify-center"
                        >

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <FiImage className="text-3xl mx-auto mb-1" />
                                    <p className="text-xs font-sans">
                                        Click para subir imagen
                                    </p>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                <FiUpload className="text-white text-2xl opacity-0 hover:opacity-100 transition-opacity" />
                            </div>

                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="hidden"
                        />

                    </div>

                    {/* Nombre */}
                    <Field
                        label="Nombre *"
                        error={errors.nombre}
                    >

                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Café Americano"
                            className={inputCls(errors.nombre)}
                        />

                    </Field>

                    {/* Descripción */}
                    <Field label="Descripción">

                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Breve descripción del producto..."
                            rows={2}
                            className={inputCls()}
                        />

                    </Field>

                    {/* Precio + Categoría */}
                    <div className="grid grid-cols-2 gap-4">

                        <Field
                            label="Precio (USD) *"
                            error={errors.precio}
                        >

                            <input
                                name="precio"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.precio}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={inputCls(errors.precio)}
                            />

                        </Field>

                        <Field
                            label="Categoría *"
                            error={errors.categoria}
                        >

                            <select
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                className={inputCls(errors.categoria)}
                            >

                                <option value="">
                                    Seleccionar...
                                </option>

                                {CATEGORIAS.map(categoria => (
                                    <option
                                        key={categoria}
                                        value={categoria}
                                    >
                                        {categoria}
                                    </option>
                                ))}

                            </select>

                        </Field>

                    </div>

                    {/* Disponible */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">

                        <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                                form.disponible
                                    ? "bg-primary"
                                    : "bg-slate-300"
                            }`}
                        >

                            <input
                                type="checkbox"
                                name="disponible"
                                checked={form.disponible}
                                onChange={handleChange}
                                className="sr-only"
                            />

                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                    form.disponible
                                        ? "translate-x-5"
                                        : ""
                                }`}
                            />

                        </div>

                        <span className="font-sans text-sm font-medium text-slate-700">
                            {form.disponible
                                ? "Disponible"
                                : "No disponible"}
                        </span>

                    </label>

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
                            : producto
                                ? "Guardar cambios"
                                : "Crear producto"}
                    </button>

                </div>

            </div>

        </div>
    )
}

// ── Components ─────────────────────────────────────────────
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

// ── Styles ─────────────────────────────────────────────────
const inputCls = (error) => `
    w-full px-3.5 py-2.5 rounded-xl border
    font-sans text-sm text-slate-800 bg-white
    outline-none transition-colors

    ${
        error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
    }
`

// ── PropTypes ──────────────────────────────────────────────
Field.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    children: PropTypes.node.isRequired,
}

ProductoForm.propTypes = {
    open: PropTypes.bool.isRequired,
    producto: PropTypes.object,
    guardando: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}