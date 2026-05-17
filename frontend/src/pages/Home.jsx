import { useState } from "react"
import { Link } from "react-router-dom"
import { FiHeart, FiBookOpen } from "react-icons/fi"
import { ClientesTab }     from "../components/ClientesTab.jsx"
import { MomentosUnicosTab } from "../components/MomentosUnicosTab.jsx"

// ── Datos ──────────────────────────────────────────────────────────────────
const EXPERIENCE_TABS = ["Nuestros Clientes", "Momentos Únicos"]

// ── Componente ─────────────────────────────────────────────────────────────
export function Home() {
    const [activeTab, setActiveTab] = useState(0)

    return (
        <div className="bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section id="home" className="py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div className="flex flex-col gap-8 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full w-fit">
                <FiHeart className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider">Un espacio para la comunidad</span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl font-black leading-tight tracking-tight">
                Un rincón{" "}
                <span className="text-primary underline decoration-secondary underline-offset-8">cálido</span>
                {" "} para compartir {" "}&amp; disfrutar
                </h1>

                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Entra a un lugar donde lo importante eres tú. Aquí cuidamos cada detalle
                para que disfrutes de momentos cálidos y especiales.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                <a href="#about"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-all">
                    <span>Nuestra Historia</span>
                    <FiBookOpen />
                </a>
                <Link to="/menu"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#D9D6D0] text-[#111818] font-bold rounded-lg hover:bg-gray-50 transition-all">
                    Explorar Menú
                </Link>
                </div>
            </div>

            {/* Image */}
            <div className="relative order-1 lg:order-2">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border-8 border-white shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80"
                    alt="Interior acogedor de cafetería"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            </section>

            {/* ── EXPERIENCES ───────────────────────────────────────────── */}
            <section id="menu" className="py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                <h2 className="font-serif text-3xl md:text-4xl font-black mb-2">Momentos que Creamos</h2>
                <p className="text-gray-500">Donde cada visita se convierte en un momento especial.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#D9D6D0]/20 p-1 rounded-lg border border-[#D9D6D0]/30">
                {EXPERIENCE_TABS.map((tab, i) => (
                    <button key={tab} onClick={() => setActiveTab(i)}
                    className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                        activeTab === i
                        ? "bg-white text-primary shadow-sm font-bold"
                        : "text-gray-500 hover:text-primary"
                    }`}>
                    {tab}
                    </button>
                ))}
                </div>
            </div>

            {/* Cards */}
            {activeTab === 0 && <ClientesTab />}
            {activeTab === 1 && <MomentosUnicosTab />}
            </section>

            {/* ── ABOUT ─────────────────────────────────────────────────── */}
            <section id="about" className="py-20 border-t border-[#D9D6D0]">
            <div className="flex flex-col lg:flex-row items-stretch gap-16">
                <div className="w-full lg:w-1/2 aspect-[400px] rounded-xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                    src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80"
                    alt="Barista preparando café con cuidado"
                    className="w-full h-full object-cover"
                />
                </div>

                <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-center">
                <h3 className="text-secondary font-bold tracking-widest uppercase text-sm">
                    Nuestra Filosofía
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight">
                    Cuidamos lo que Ofrecemos, Valoramos a Quien Nos Visita
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    Creemos que cada visita debe sentirse especial.
                    Por eso, cuidamos cada detalle para ofrecerte no solo calidad, sino una experiencia cálida, cercana y auténtica.
                    <br />
                    Trabajamos con productos ecuatorianos y, sobre todo, con la intención de brindarte un espacio donde puedas disfrutar, 
                    desconectar y sentirte bien en cualquier momento del día.
                    <br />
                    Nuestro compromiso es simple: que siempre quieras volver.
                </p>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-primary">Esencia Local</span>
                    <span className="text-sm font-semibold uppercase tracking-tight opacity-70">Sabor con identidad.</span>
                    </div>
                    <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-primary">Artesanal</span>
                    <span className="text-sm font-semibold uppercase tracking-tight opacity-70">hecho con pasión.</span>
                    </div>
                </div>

                
                </div>
            </div>
            </section>

        </div>
        </div>
    )
}