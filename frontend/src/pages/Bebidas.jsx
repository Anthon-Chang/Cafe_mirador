// ── Datos ──────────────────────────────────────────────────────────────────
const BEBIDAS = [
    {
        title:   "CAFÉS TRADICIONALES",
        desc:    "Desde el intenso espresso hasta el suave americano, disfruta de la esencia pura del grano tostado a la perfección por nuestros baristas expertos. Seleccionamos granos de origen único para garantizar un perfil de sabor inigualable en cada taza.",
        img:     "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        alt:     "Taza de café humeante",
        reverse: false,
    },
    {
        title:   "MILKSHAKES",
        desc:    "Batidos cremosos e irresistibles con los sabores más dulces, perfectos para cualquier momento del día. Coronados con crema batida artesanal y toppings seleccionados que elevan el sabor a otro nivel.",
        img:     "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
        alt:     "Milkshake cremoso con toppings",
        reverse: true,
    },
    {
        title:   "COCOA",
        desc:    "Deléitate con nuestra selección de chocolates calientes y fríos, elaborados con el cacao más fino de la región. Una experiencia reconfortante y rica en antioxidantes que abraza el paladar.",
        img:     "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80",
        alt:     "Chocolate caliente con malvaviscos",
        reverse: false,
    },
    {
        title:   "FRAPPELATES Y LATTES",
        desc:    "La combinación perfecta entre la intensidad del espresso y la suavidad de la leche vaporizada o frappé. Desde el clásico latte art hasta creaciones heladas con caramelo y vainilla.",
        img:     "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
        alt:     "Frappé de café helado",
        reverse: true,
    },
    ]

    // ── Componente ─────────────────────────────────────────────────────────────
export function Bebidas() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12">

            {/* Hero title */}
            <div className="mb-16">
                <h1 className="text-primary text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                Nuestras Bebidas
                </h1>
                <p className="text-lg text-[#8c815f] max-w-2xl leading-relaxed">
                Explora nuestra cuidadosa selección de granos de especialidad, mezclas artesanales y
                preparaciones únicas diseñadas para despertar tus sentidos.
                </p>
            </div>

            {/* Categorías zigzag */}
            <div className="space-y-24">
                {BEBIDAS.map((b) => (
                <section key={b.title}
                    className={`flex flex-col gap-12 lg:gap-20 items-center ${
                    b.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                    }`}>

                    {/* Texto */}
                    <div className="flex-1 space-y-6">
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