import PropTypes from "prop-types"
import { FiAlertCircle, FiX } from "react-icons/fi"

export function ErrorAlert({ message, onClose }) {
    if (!message) return null

    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
            <FiAlertCircle className="shrink-0" />
            <span className="text-sm font-sans">{message}</span>
            <button onClick={onClose} className="ml-auto">
                <FiX />
            </button>
        </div>
    )
}

ErrorAlert.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
}

ErrorAlert.defaultProps = {
    message: null,
}