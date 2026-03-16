import { Link } from "react-router-dom"

// ── Datos ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
    {
        title:   "Bebidas",
        desc:    "Descubre nuestra selección artesanal de cafés. Desde el tradicional espresso con notas intensas hasta nuestros cremosos milkshakes que combinan texturas suaves y sabores refrescantes.",
        to:      "/bebidas",
        btn:     "Ver Bebidas",
        img:     "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
        imgAlt:  "Latte artesanal",
        reverse: false,
    },
    {
        title:   "Productos de Vitrina",
        desc:    "Nuestra repostería sigue recetas tradicionales cargadas de dulzura. Croissants hojaldrados, pasteles artesanales y bocados dulces preparados cada mañana para acompañar tu momento ideal.",
        to:      "/tradicionales",
        btn:     "Ver Dulces",
        img:     "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
        imgAlt:  "Pasteles artesanales",
        reverse: true,
    },
    {
        title:   "Nutricional",
        desc:    "Equilibrio y sabor en cada bocado. Explora nuestras opciones saludables, bowls de frutas y preparaciones bajas en calorías diseñadas para quienes buscan bienestar sin renunciar al placer.",
        to:      "/nutricional",
        btn:     "Ver Opciones Saludables",
        img:     "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        imgAlt:  "Bowl saludable",
        reverse: false,
    },
    {
        title:   "Heladería",
        desc:    "Deléitate con nuestros helados artesanales, elaborados con ingredientes frescos y sabores innovadores. Desde clásicos como vainilla y chocolate hasta creaciones únicas que cambian según la temporada.",
        to:      "/heladeria",
        btn:     "Ver Helados",
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
                <div className="relative aspect-[16/10] lg:aspect-square rounded-xl overflow-hidden shadow-2xl">
                <img src={cat.img} alt={cat.imgAlt}
                    className="w-full h-full object-cover" />
                </div>
            </div>
            </div>
        ))}
        </section>
    )
}