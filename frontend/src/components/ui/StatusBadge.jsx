import PropTypes from "prop-types"
import { STATUS_CONFIG } from "../../utils/constants"

export function StatusBadge({ estado }) {
    const config = STATUS_CONFIG[estado]
    if (!config) return null

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${config.classes}`}>
            {config.label}
        </span>
    )
}

StatusBadge.propTypes = {
    estado: PropTypes.oneOf(["pendiente", "procesando", "completado", "cancelado"]).isRequired,
}