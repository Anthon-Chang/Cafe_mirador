import PropTypes from "prop-types"
import { FiAlertTriangle, FiX } from "react-icons/fi"

/**
 * Modal de confirmación para acciones peligrosas (eliminar, cambiar rol, etc.)
 */
export function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel  = "Cancelar",
    danger       = true,
    loading      = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Panel */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeIn_.15s_ease-out]">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <FiX className="text-xl" />
                </button>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    danger ? "bg-red-50" : "bg-primary/10"
                }`}>
                    <FiAlertTriangle className={`text-2xl ${danger ? "text-red-500" : "text-primary"}`} />
                </div>

                <h3 className="font-sans font-extrabold text-lg text-slate-800 mb-2">
                    {title}
                </h3>
                <p className="font-sans text-sm text-slate-500 mb-6">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl font-sans font-semibold text-sm text-white transition-colors disabled:opacity-50 ${
                            danger
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-primary hover:bg-primary/90"
                        }`}
                    >
                        {loading ? "Procesando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

ConfirmModal.propTypes = {
    open:         PropTypes.bool.isRequired,
    title:        PropTypes.string.isRequired,
    message:      PropTypes.string.isRequired,
    confirmLabel: PropTypes.string,
    cancelLabel:  PropTypes.string,
    danger:       PropTypes.bool,
    loading:      PropTypes.bool,
    onConfirm:    PropTypes.func.isRequired,
    onCancel:     PropTypes.func.isRequired,
}