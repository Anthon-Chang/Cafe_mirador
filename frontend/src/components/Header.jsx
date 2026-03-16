import { useState } from "react"
import { Link } from "react-router-dom"
import { FiCoffee, FiMenu, FiX } from "react-icons/fi"

const NAV_LINKS = [
    { label: "Inicio",           to: "/"         },
    { label: "Menú",             to: "/menu"      },
    { label: "Nuestra Historia", to: "/#about"    },
    { label: "Visítanos",        to: "/#location" },
    ]

    export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#D9D6D0]/30 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                <FiCoffee className="text-xl" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
                CAFE<span className="text-primary">MIRADOR</span>
            </h2>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to}
                className="text-sm font-semibold hover:text-primary transition-colors">
                {l.label}
                </Link>
            ))}
            </nav>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
            <Link to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-[#D9D6D0] hover:border-primary hover:text-primary transition-all">
                Iniciar sesión
            </Link>
            <Link to="/register"
                className="text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white hover:-translate-y-0.5 shadow-lg shadow-primary/25 transition-all">
                Registrarse
            </Link>
            </div>

            {/* Hamburger */}
            <button className="md:hidden text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-[#D9D6D0]/30 pt-4">
            {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold hover:text-primary transition-colors">
                {l.label}
                </Link>
            ))}
            <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-lg border-2 border-[#D9D6D0]">
                Iniciar sesión
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white">
                Registrarse
                </Link>
            </div>
            </div>
        )}
        </header>
    )
}