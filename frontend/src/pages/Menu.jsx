import { Link } from "react-router-dom"

// ── Datos ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
    {
        title:   "Bebidas",
        desc:    "Descubre nuestra selección de bebidas calientes y frías. Desde opciones reconfortantes hasta refrescantes, cada sorbo está preparado para acompañarte y hacer de tu experiencia algo especial.",
        to:      "/bebidas",
        btn:     "Ver Bebidas",
        img:     "https://plus.unsplash.com/premium_photo-1755520880464-fe32ef3efedb?q=80&w=1246&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imgAlt:  "Latte artesanal",
        reverse: false,
    },
    {
        title:   "Tradicionales",
        desc:    "En nuestra selección de tradicionales, celebramos sabores que evocan hogar y memorias. Cada bocado, hecho con cariño y autenticidad, te invita a disfrutar lo simple y verdaderamente especial.",
        to:      "/tradicionales",
        btn:     "Ver Tradicionales",
        img:     "https://images.unsplash.com/photo-1609525313344-a56b96f20718?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imgAlt:  "Pasteles artesanales",
        reverse: true,
    },
    {
        title:   "Especialidades",
        desc:    "En nuestras especialidades encontrarás combinaciones irresistibles pensadas para disfrutar sin prisa. Preparados al momento y con ese toque casero que convierte cada elección en una experiencia deliciosa.”",
        to:      "/comidas",
        btn:     "Ver Especialidades",
        img:     "https://plus.unsplash.com/premium_photo-1667807521536-bc35c8d8b64b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imgAlt:  "especialidades",
        reverse: false,
    },
    {
        title:   "Heladería",
        desc:    "En nuestra heladería, cada opción es un pequeño antojo hecho realidad. Desde preparaciones artesanales hasta combinaciones irresistibles, encontrarás sabores frescos y texturas que invitan a disfrutar, compartir y dejarte llevar por lo dulce.",
        to:      "/heladeria",
        btn:     "Ver Heladería",
        img:     "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80",
        imgAlt:  "Helados artesanales",
        reverse: true,
    },
    ]

    // ── Componente ─────────────────────────────────────────────────────────────
    export function Menu() {
    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-20 py-12 lg:py-16 space-y-16 lg:space-y-24">
        {CATEGORIES.map((cat) => (
            <div key={cat.title}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Texto */}
            <div className={`flex flex-col items-start gap-6 ${
                cat.reverse ? "order-2 lg:items-end lg:text-right" : "order-2 lg:order-1"
            }`}>
                <h2 className="text-4xl lg:text-5xl font-black text-primary tracking-tight uppercase">
                {cat.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {cat.desc}
                </p>
                <Link to={cat.to}
                className="bg-secondary hover:brightness-105 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-secondary/20">
                {cat.btn}
                </Link>
            </div>

            {/* Imagen */}
            <div className={cat.reverse ? "order-1" : "order-1 lg:order-2"}>
                <div className="relative aspect-16/10 lg:aspect-square rounded-xl overflow-hidden shadow-2xl">
                <img src={cat.img} alt={cat.imgAlt}
                    className="w-full h-full object-cover" />
                </div>
            </div>
            </div>
        ))}
        </section>
    )
}