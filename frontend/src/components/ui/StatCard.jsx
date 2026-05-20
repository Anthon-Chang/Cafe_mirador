import PropTypes from "prop-types"

export function StatCard({ label, value, sub, icon, color, accent, loading }) {
    return (
        <div className={`bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden ${accent ?? ""}`}>
            {icon}
            <p className="text-sm font-sans font-medium text-slate-500 mb-1">{label}</p>
            <h3 className={`text-2xl font-sans font-bold text-slate-800 mb-1 ${loading ? "animate-pulse" : ""}`}>
                {loading ? "..." : value}
            </h3>
            <div className={`text-xs font-sans font-semibold ${color}`}>
                {loading ? "" : sub}
            </div>
        </div>
    )
}

StatCard.propTypes = {
    label:   PropTypes.string.isRequired,
    value:   PropTypes.string.isRequired,
    sub:     PropTypes.string,
    icon:    PropTypes.node,
    color:   PropTypes.string,
    accent:  PropTypes.string,
    loading: PropTypes.bool,
}

StatCard.defaultProps = {
    sub:     "",
    icon:    null,
    color:   "",
    accent:  "",
    loading: false,
}