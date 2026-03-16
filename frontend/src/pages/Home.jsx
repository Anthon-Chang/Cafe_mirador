import { useState } from "react"
import { Link } from "react-router-dom"
import { FiHeart, FiBookOpen } from "react-icons/fi"

// ── Datos ──────────────────────────────────────────────────────────────────
const EXPERIENCE_TABS = ["Momentos Café", "Vida Pausada", "Bocados Sociales"]

const EXPERIENCES = [
    {
        title: "Rituales Mañaneros",
        desc:  "Despierta tus sentidos con nuestras mezclas insignia. Diseñadas para brindarte un comienzo firme con notas de avellana tostada.",
        tag:   "Saborea la calma",
        img:   "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    },
    {
        title: "Tardes Acogedoras",
        desc:  "Lattes de terciopelo con leche de avena prensada en casa. Un abrazo cálido en taza de cerámica, perfecto para largas conversaciones.",
        tag:   "Encuentra tu rincón",
        img:   "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
    },
    {
        title: "Enfoque Tranquilo",
        desc:  "Nuestro cold brew de maceración lenta de 24 horas: energía suave y sostenida para tus horas creativas. Mínima acidez, máxima claridad.",
        tag:   "Concentración pura",
        img:   "https://images.unsplash.com/photo-1517959105821-eaf2591984d2?w=400&q=80",
    },
    {
        title: "Dulce Indulgencia",
        desc:  "Complementa tu ritual con pasteles artesanales horneados cada día. Texturas hojaldradas que realzan los perfiles complejos de nuestro café.",
        tag:   "La combinación perfecta",
        img:   "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    },
    ]

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
                Reúnete por el{" "}
                <span className="text-primary underline decoration-secondary underline-offset-8">Calor</span>
                {" "}&amp; el Café Excepcional
                </h1>

                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Entra a un santuario donde cada taza cuenta una historia. Nos enfocamos en las personas,
                el ambiente y los rituales compartidos que hacen la vida más dulce.
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
                <p className="text-gray-500">No solo bebidas, sino experiencias pensadas para tu día.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {EXPERIENCES.map((exp) => (
                <div key={exp.title}
                    className="group bg-white p-5 rounded-xl border border-[#D9D6D0] hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-[4/5] rounded-lg mb-6 overflow-hidden bg-gray-100">
                    <img src={exp.img} alt={exp.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="font-extrabold text-xl mb-3 text-primary">{exp.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.desc}</p>
                    <div className="mt-6 pt-4 border-t border-[#D9D6D0]/50">
                    <span className="text-secondary font-bold text-xs uppercase tracking-widest">
                        {exp.tag}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </section>

            {/* ── ABOUT ─────────────────────────────────────────────────── */}
            <section id="about" className="py-20 border-t border-[#D9D6D0]">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                    src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80"
                    alt="Barista preparando café con cuidado"
                    className="w-full h-full object-cover"
                />
                </div>

                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h3 className="text-secondary font-bold tracking-widest uppercase text-sm">
                    Nuestra Filosofía
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight">
                    Cultivado con Cuidado, Servido con Corazón
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    Creemos que la taza perfecta comienza mucho antes de que el agua toque el café. Empieza
                    con la comunidad. Trabajamos con fincas sostenibles para que cada grano apoye a una familia,
                    así como cada taza en nuestro local apoya una conversación local.
                </p>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-primary">Sostenible</span>
                    <span className="text-sm font-semibold uppercase tracking-tight opacity-70">Origen Ético</span>
                    </div>
                    <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-primary">Artesanal</span>
                    <span className="text-sm font-semibold uppercase tracking-tight opacity-70">Tostados en Pequeños Lotes</span>
                    </div>
                </div>

                <button className="mt-4 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all w-fit">
                    Lee Nuestra Historia Completa
                </button>
                </div>
            </div>
            </section>
        </div>
        </div>
    )
    }