const PLATOS = [
    {
        tag:     "JUGOSA & SABROSA",
        title:   "HAMBURGUESAS",
        desc:    "Nuestras hamburguesas son puro placer en cada bocado. Con ingredientes de alta calidad, combinan sabores intensos y jugosos que las hacen simplemente irresistibles.",
        img:     "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        alt:     "Bowl de frutas frescas",
        reverse: false,
    },
    {
        tag:     "SALUDABLE & NUTRITIVA",
        title:   "OMELETTES",
        desc:    "Nuestros omelettes son la opción perfecta para quienes buscan una comida saludable y deliciosa. Con ingredientes frescos y nutritivos, cada bocado es una explosión de sabor que te mantendrá lleno de energía durante todo el día.",
        img:     "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&q=80",
        alt:     "Batido verde proteico",
        reverse: true,
    },
    ]

// ── Componente ─────────────────────────────────────────────────────────────
    export function Comidas() {
    return (

        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8 lg:py-12">

            {/* Título */}
            <div className="mb-16">
            <h1 className="text-primary text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                Platos Fuertes
            </h1>
            <p className="text-lg text-[#8c815f] max-w-2xl leading-relaxed">
                Explora nuestra cuidadosa selección de granos de especialidad, mezclas artesanales y
                preparaciones únicas diseñadas para despertar tus sentidos.
            </p>
            </div>

            {/* Categorías zigzag */}
            <div className="space-y-24">
            {PLATOS.map((b) => (
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