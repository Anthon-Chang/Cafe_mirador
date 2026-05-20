import PropTypes from "prop-types"
import { Link, useLocation } from "react-router-dom"
import {
    FiGrid, FiShoppingBag, FiPlusCircle,
    FiBookOpen, FiBarChart2, FiUser
} from "react-icons/fi"
import { useAuth }        from "../context/useAuth"
import { nombreCompleto, capitalize } from "../utils/formatters"

const NAV_ITEMS = [
    { label: "Dashboard",    icon: <FiGrid />,        to: "/admin/dashboard"  },
    { label: "Pedidos",      icon: <FiShoppingBag />, to: "/admin/pedidos"    },
    { label: "Nueva Venta",  icon: <FiPlusCircle />,  to: "/admin/venta"      },
    { label: "Menú Manager", icon: <FiBookOpen />,    to: "/admin/menu"       },
    { label: "Analíticas",   icon: <FiBarChart2 />,   to: "/admin/analiticas" },
    { label: "Perfil",       icon: <FiUser />,        to: "/admin/perfil"     },
]

export function DashboardSidebar({ open, onClose }) {
    const { pathname } = useLocation()
    const { usuario }  = useAuth()

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-64 bg-slate-900 border-r border-slate-800
                flex flex-col shrink-0 transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img
                            src="/logo1.png"
                            alt="Logo Café Mirador"
                            className="w-full h-full object-contain mix-blend-screen"
                        />
                    </div>
                    <h1 className="font-sans text-xl font-extrabold tracking-tight text-white">
                        CAFE<span className="text-primary">MIRADOR</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.to
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans font-medium transition-colors text-sm
                                    ${isActive
                                        ? "bg-primary text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }
                                `}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                            <FiUser className="text-primary text-lg" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-sans font-semibold text-white truncate">
                                {usuario ? nombreCompleto(usuario) : "Cargando..."}
                            </p>
                            <p className="text-xs font-sans text-slate-500">
                                {usuario ? capitalize(usuario.rol) : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

DashboardSidebar.propTypes = {
    open:    PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}