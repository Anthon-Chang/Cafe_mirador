import PropTypes from "prop-types"
import { FiMenu, FiX, FiLogOut, FiRefreshCw } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

export function DashboardHeader({ title, sidebarOpen, onToggleSidebar, onRefresh }) {
    const { logout } = useAuth()
    const navigate   = useNavigate()

    return (
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden text-slate-600 text-2xl"
                    onClick={onToggleSidebar}
                >
                    {sidebarOpen ? <FiX /> : <FiMenu />}
                </button>
                <h2 className="font-sans text-xl lg:text-2xl font-extrabold tracking-tight text-slate-800">
                    {title}
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-sans font-medium text-slate-500">En vivo</span>
                </div>

                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Refrescar datos"
                    >
                        <FiRefreshCw className="text-lg" />
                    </button>
                )}

                <button
                    onClick={() => logout(navigate)}
                    className="flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-lg border border-red-500/50 text-red-500 text-sm font-sans font-semibold hover:bg-red-500/10 transition-colors"
                >
                    <FiLogOut className="text-base" />
                    <span className="hidden sm:inline">Salir</span>
                </button>
            </div>
        </header>
    )
}

DashboardHeader.propTypes = {
    title:           PropTypes.string.isRequired,
    sidebarOpen:     PropTypes.bool.isRequired,
    onToggleSidebar: PropTypes.func.isRequired,
    onRefresh:       PropTypes.func,
}

DashboardHeader.defaultProps = {
    onRefresh: null,
}