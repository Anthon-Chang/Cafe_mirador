    const PRODUCTOS = [
    {
        tag:     "tradicion & sabor",
        title:   "EMPANADAS",
        desc:    "Nuestra selección de empanadas está inspirada en recetas tradicionales cargadas de historia y sabor. Desde empanadas de viento hasta empanadas de morocho.",
        img:     "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
        alt:     "Cupcakes artesanales",
        reverse: false,
    },
    {
        tag:     "Auténtico & Casero",
        title:   "HUMITAS & QUIMBOLITOS",
        desc:    "Disfruta de nuestras humitas y quimbolitos, preparaciones suaves y llenas de tradición que conquistan con su textura delicada y su sabor reconfortante. Son el acompañante perfecto para un momento cálido y especial.",
        img:     "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
        alt:     "Humitas y quimbolitos",
        reverse: true,
    },
    {
        tag:     "delicia & tradición",
        title:   "Sanduches",
        desc:    "Nuestros sándwiches artesanales son una experiencia culinaria que combina ingredientes frescos y de alta calidad con recetas cuidadosamente elaboradas. Cada bocado es una explosión de sabores, desde combinaciones clásicas hasta creaciones innovadoras, diseñadas para satisfacer los paladares más exigentes.",
        img:     "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
        alt:     "Sandwiches artesanales",
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
                    <div className="aspect-4/3 rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                    <img src={b.img} alt={b.alt} className="w-full h-full object-cover" />
                    </div>
                </div>
                </section>
            ))}
            </div>
        </div>
    )
}