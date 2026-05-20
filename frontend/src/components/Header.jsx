import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi"

const NAV_LINKS = [
    { label: "Inicio",           to: "/#home"         },
    { label: "Menú",             to: "/menu"      },
    { label: "Nuestra Historia", to: "/#about"    },
    { label: "Visítanos",        to: "/#location" },
]

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    const handleAnchorClick = (e, to) => {
        if (to.includes("#")) {
            e.preventDefault()
            const [path, id] = to.split("#")

            setMobileOpen(false)

            if (window.location.pathname === path || path === "") {
                const el = document.getElementById(id)
                if (el) el.scrollIntoView({ behavior: "smooth" })
            } else {
                navigate(path || "/")
                setTimeout(() => {
                    const el = document.getElementById(id)
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                }, 100)
            }
        }
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#D9D6D0]/30 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-l overflow-hidden flex items-center justify-center">
                <img
                    src="/logo1.png"
                    alt="Logo Café Mirador"
                    className="w-full h-full object-contain"
                />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
                CAFE<span className="text-primary">MIRADOR</span>
            </h2>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
                <Link
                key={l.to}
                to={l.to}
                onClick={(e) => handleAnchorClick(e, l.to)}
                className="text-sm font-semibold hover:text-primary transition-colors"
                >
                {l.label}
                </Link>
            ))}
            </nav>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
            <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-[#D9D6D0] hover:border-primary hover:text-primary transition-all"
            >
                Iniciar sesión
            </Link>
            <Link
                to="/register"
                className="text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white hover:-translate-y-0.5 shadow-lg shadow-primary/25 transition-all"
            >
                Registrarse
            </Link>
            </div>

            {/* Hamburger */}
            <button
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="md:hidden text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            >
            {mobileOpen ? <FiX /> : <FiMenu />}
            </button>

        </div>

        {/* Mobile menu */}
        <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
            <div className="mt-4 pb-4 flex flex-col gap-4 border-t border-[#D9D6D0]/30 pt-4">
            {NAV_LINKS.map((l) => (
                <Link
                key={l.to}
                to={l.to}
                onClick={(e) => handleAnchorClick(e, l.to)}
                className="text-sm font-semibold hover:text-primary transition-colors"
                >
                {l.label}
                </Link>
            ))}
            <div className="flex gap-3 pt-2">
                <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-lg border-2 border-[#D9D6D0]"
                >
                Iniciar sesión
                </Link>
                <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white"
                >
                Registrarse
                </Link>
            </div>
            </div>
        </div>
        </header>
    )
}