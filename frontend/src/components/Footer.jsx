import { FiCoffee, FiShare2, FiGlobe, FiCamera, FiClock, FiMapPin } from "react-icons/fi"

const HOURS = [
    { day: "Lunes – Viernes", time: "7am – 8pm" },
    { day: "Sábado",          time: "8am – 9pm" },
    { day: "Domingo",         time: "8am – 6pm" },
    ]

    const FOOTER_LINKS = ["Nuestro Equipo", "Sostenibilidad", "Tarjetas de Regalo", "Trabaja con Nosotros"]

    export function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-[#D9D6D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                <FiCoffee className="text-primary text-3xl" />
                <h2 className="text-xl font-extrabold tracking-tight">BREWMODERN</h2>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                Elevando tu ritual diario de café a través de la artesanía meticulosa y el enfoque en comunidad.
                </p>
                <div className="flex gap-4">
                {[FiShare2, FiGlobe, FiCamera].map((Icon, i) => (
                    <a key={i} href="#"
                    className="w-10 h-10 rounded-lg bg-[#D9D6D0]/30 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Icon className="text-xl" />
                    </a>
                ))}
                </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                <FiClock className="text-primary" /> Horario
                </h4>
                <ul className="text-sm text-gray-500 flex flex-col gap-3">
                {HOURS.map((h) => (
                    <li key={h.day} className="flex justify-between">
                    <span>{h.day}</span>
                    <span className="text-[#111818] font-medium">{h.time}</span>
                    </li>
                ))}
                </ul>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-4">
                <h4 className="font-bold text-lg">Sobre Nosotros</h4>
                <ul className="text-sm text-gray-500 flex flex-col gap-3">
                {FOOTER_LINKS.map((l) => (
                    <li key={l}>
                    <a href="#" className="hover:text-primary transition-colors">{l}</a>
                    </li>
                ))}
                </ul>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                <FiMapPin className="text-primary" /> Encuéntranos
                </h4>
                <div className="w-full h-32 rounded-lg overflow-hidden bg-primary/10 border border-[#D9D6D0] flex items-center justify-center text-primary text-sm font-semibold">
                📍 Seattle, WA
                </div>
                <p className="text-sm text-gray-500">
                123 Espresso Lane, Distrito Cafeína<br />Seattle, WA 98101
                </p>
            </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-[#D9D6D0]/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 uppercase tracking-widest font-semibold">
            <p>© 2024 Brew Modern Coffee. Todos los derechos reservados.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
                <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            </div>
            </div>
        </div>
        </footer>
    )
}