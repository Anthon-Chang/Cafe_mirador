    const PRODUCTOS = [
    {
        tag:     "Clásicos",
        title:   "DULCES",
        desc:    "Nuestra selección de dulces está inspirada en recetas tradicionales cargadas de historia y dulzura. Desde cupcakes artesanales con frosting de seda hasta pequeños bocados llenos de sabor, cada pieza es una obra de arte preparada con ingredientes de la más alta calidad.",
        img:     "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
        alt:     "Cupcakes artesanales",
        reverse: false,
    },
    {
        tag:     "Gourmet",
        title:   "SAL",
        desc:    "Para quienes prefieren un contraste, nuestra sección de sal ofrece opciones gourmet preparadas al momento. Sandwiches artesanales con pan de masa madre, quiches de temporada y bocadillos salados que elevan tu experiencia de brunch.",
        img:     "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
        alt:     "Sandwiches artesanales",
        reverse: true,
    },
    {
        tag:     "Premium",
        title:   "REPOSTERÍA ARTESANAL",
        desc:    "Descubre nuestra repostería premium donde el sabor se une con la técnica. Pasteles de diseño, cheesecakes de textura inigualable y creaciones exclusivas que capturan la esencia de la pastelería moderna con un toque hogareño.",
        img:     "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
        alt:     "Cheesecake artesanal",
        reverse: false,
    },
    ]

    // ── Componente ─────────────────────────────────────────────────────────────
    export function Tradicionales() {

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8 lg:py-12">

            {/* Título */}
            <div className="mb-16">
            <h1 className="text-primary text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                Tradicionales
            </h1>
            <p className="text-lg text-[#8c815f] max-w-2xl leading-relaxed">
                Explora nuestra cuidadosa selección de granos de especialidad, mezclas artesanales y
                preparaciones únicas diseñadas para despertar tus sentidos.
            </p>
            </div>

            {/* Categorías zigzag */}
            <div className="space-y-24">
            {PRODUCTOS.map((b) => (
                <section key={b.title}
                className={`flex flex-col gap-12 lg:gap-20 items-center ${
                    b.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}>

                {/* Texto */}
                <div className="flex-1 space-y-6">
                    <div className="inline-block px-3 py-1 bg-secondary/20 text-[#181611] rounded-full text-xs font-bold uppercase tracking-widest">
                    {b.tag}
                    </div>
                    <h2 className="text-primary text-4xl font-bold leading-tight">{b.title}</h2>
                    <p className="text-[#8c815f] text-lg leading-relaxed">{b.desc}</p>
                </div>

                {/* Imagen */}
                <div className="flex-1 w-full">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                    <img src={b.img} alt={b.alt} className="w-full h-full object-cover" />
                    </div>
                </div>
                </section>
            ))}
            </div>
        </div>
    )
}