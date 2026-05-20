import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardHeader }  from "./DashboardHeader"

// Mapeo de rutas a títulos
const TITLES = {
    "/admin/dashboard":  "Dashboard",
    "/admin/pedidos":    "Pedidos",
    "/admin/venta":      "Nueva Venta",
    "/admin/menu":       "Menú Manager",
    "/admin/analiticas": "Analíticas",
    "/admin/perfil":     "Perfil",
}

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { pathname } = useLocation()
    const title = TITLES[pathname] ?? "Admin"

    return (
        <div className="flex h-screen overflow-hidden bg-[#f5f7f8]">
            <DashboardSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
                <DashboardHeader
                    title={title}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />
                {/* Las páginas del admin se renderizan aquí */}
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}