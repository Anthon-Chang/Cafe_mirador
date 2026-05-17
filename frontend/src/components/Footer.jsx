import { useState } from "react"
import { FiShare2, FiClock, FiMapPin, FiX } from "react-icons/fi"
import { SiGoogle, SiInstagram } from "react-icons/si"

const HOURS = [
    { day: "Lunes – Viernes", time: "11 am – 18 pm" },
    { day: "Sábado – Domingo", time: "9 am – 19 pm" },
    { day: "Días Festivos",    time: "9 am – 19 pm" },
    ]

    const FOOTER_LINKS = [
    {
        label: "Nuestro Equipo",
        description: "Somos un equipo comprometido con brindar una experiencia cálida y memorable en cada visita. Creemos en la autenticidad, el buen trato y la atención a los detalles que hacen sentir a cada cliente especial. Cada miembro de nuestro equipo ha sido elegido por su dedicación al servicio y su capacidad de crear un ambiente acogedor, donde cada persona se sienta bienvenida y quiera volver."
    },
    {
        label: "Sostenibilidad",
        description: "En Café Mirador nos comprometemos con el medio ambiente y las comunidades locales. Trabajamos directamente con productores responsables, usamos empaques biodegradables y reducimos nuestra huella de carbono en cada proceso. Cada taza que disfrutas es parte de un futuro más verde."
    },
    {
        label: "Trabaja con Nosotros",
        description: "¿Te apasiona el café y el servicio al cliente? En Café Mirador buscamos personas auténticas, con energía y ganas de crecer. Ofrecemos un ambiente de trabajo cálido, capacitación continua y la oportunidad de ser parte de algo especial. ¡Escríbenos y conversemos!"
    },
    ]

    const LEGAL_LINKS = [
    {
        label: "Política de Privacidad",
        description: "En Café Mirador respetamos y protegemos tu información personal. Los datos que recopilamos se usan únicamente para mejorar tu experiencia con nosotros y nunca son compartidos con terceros sin tu consentimiento. Tu privacidad es nuestra prioridad."
    },
    {
        label: "Términos de Servicio",
        description: "Al usar nuestros servicios digitales aceptas nuestras condiciones de uso. Nos comprometemos a brindarte una experiencia segura, transparente y de calidad. Si tienes alguna duda sobre nuestros términos, no dudes en contactarnos directamente."
    },
    ]

    const SOCIAL_LINKS = [
    { icon: FiShare2,    href: null,                                label: "Compartir página" },
    { icon: SiGoogle,    href: "https://play.google.com/store",     label: "Google Apps"      },
    { icon: SiInstagram, href: "https://www.instagram.com/cafemiradorpululahualounge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram"        },
    ]

    export function Footer() {
    const [activeModal, setActiveModal] = useState(null)

    return (
        <footer className="bg-white pt-20 pb-10 border-t border-[#D9D6D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                <img
                    src="/icono2.png"
                    alt="Logo Café Mirador"
                    className="w-7 h-7 object-contain rounded-l relative -top-0.5"
                />
                <h2 className="text-xl font-extrabold tracking-tight">CAFÉ MIRADOR</h2>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                En Café Mirador, elevamos tu experiencia de café, creando momentos que se sienten, se disfrutan y permanecen.
                </p>
                <div className="flex gap-4">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                    key={label}
                    href={href ?? "#"}
                    target={href ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={!href ? (e) => { e.preventDefault(); navigator.share?.({ title: "Café Mirador", url: window.location.href }) } : undefined}
                    className="w-10 h-10 rounded-lg bg-[#D9D6D0]/30 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
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
                    <li key={l.label}>
                    <button
                        onClick={() => setActiveModal(l)}
                        className="hover:text-primary transition-colors text-left"
                    >
                        {l.label}
                    </button>
                    </li>
                ))}
                </ul>
            </div>

            {/* Location */}
            <div id="location" className="flex flex-col gap-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                <FiMapPin className="text-primary" /> Encuéntranos
                </h4>
                <div className="w-full h-35 rounded-lg overflow-hidden border border-[#D9D6D0]">
                <iframe
                    title="Ubicación Café Mirador"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d528.3831478527289!2d-78.48242467553456!3d0.02403259103907998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a782415231c71%3A0xca4b47630f68d106!2sCaf%C3%A9%20Mirador!5e0!3m2!1ses!2sec!4v1773721881523!5m2!1ses!2sec"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                </div>
                <p className="text-sm text-gray-500">
                Reserva Geobotánica Pululahua, Estacionamiento del Mirador del Pululahua,
                2GF9+H4 Quito.
                </p>
            </div>

            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-[#D9D6D0]/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 uppercase tracking-widest font-semibold">
            <p>© 2026 Café Mirador. Todos los derechos reservados.</p>
            <div className="flex gap-6">
                {LEGAL_LINKS.map((l) => (
                <button
                    key={l.label}
                    onClick={() => setActiveModal(l)}
                    className="hover:text-primary transition-colors uppercase tracking-widest font-semibold"
                >
                    {l.label}
                </button>
                ))}
            </div>
            </div>
        </div>

        {/* Modal */}
        {activeModal && (
            <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setActiveModal(null)}
            >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                onClick={() => setActiveModal(null)}
                aria-label="Cerrar"
                className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
                >
                <FiX className="text-xl" />
                </button>
                <h3 className="text-xl font-extrabold mb-4">{activeModal.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{activeModal.description}</p>
            </div>
            </div>
        )}

        </footer>
    )
}