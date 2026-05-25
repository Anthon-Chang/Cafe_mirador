import PropTypes from "prop-types"
import { useEffect } from "react"
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi"

/**
 * Toast de notificación flotante, auto-cierra en 4s.
 */
export function Toast({ type = "success", message, onClose }) {
    useEffect(() => {
        if (!message) return
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [message, onClose])

    if (!message) return null

    const isSuccess = type === "success"

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border font-sans text-sm font-medium max-w-sm animate-[slideUp_.2s_ease-out] ${
            isSuccess
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
        }`}>
            {isSuccess
                ? <FiCheckCircle className="text-xl text-green-500 shrink-0" />
                : <FiXCircle className="text-xl text-red-500 shrink-0" />
            }
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-1">
                <FiX />
            </button>
        </div>
    )
}

Toast.propTypes = {
    type:    PropTypes.oneOf(["success", "error"]),
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
}