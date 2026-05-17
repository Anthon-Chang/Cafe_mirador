// ── Datos ──────────────────────────────────────────────────────────────────
const BEBIDAS = [
    {
        tag:     "Intenso & Aromático",
        title:   "CAFÉS TRADICIONALES",
        desc:    "Desde el intenso espresso, pasando por el cremoso cappuccino, hasta el suave americano. Cada taza se elabora con dedicación y técnica, resaltando aromas y sabores.",
        img:     "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        alt:     "Taza de café humeante",
        reverse: false,
    },   
    {
        tag:     "Cremoso & Reconfortante",
        title:   "COCHOLATE CALIENTE",
        desc:    "Deléitate con una taza de chocolate caliente, preparados con auténtico chocolate de tableta. Una bebida reconfortante que envuelve el paladar con su sabor profundo y tradicional, perfecta para disfrutar cada sorbo.",
        img:     "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80",
        alt:     "Chocolate caliente",
        reverse: true,
    },
    {
        tag:     "Refrescante & tropical",
        title:   "BEBIDAS FRÍAS",
        desc:    "Refresca tu día con nuestra selección de bebidas frías, desde jugos naturales y batidos hasta irresistibles milkshakes. Preparadas al momento, cada opción combina frescura, sabor y una textura deliciosa.",
        img:     "https://images.unsplash.com/photo-1583577612013-4fecf7bf8f13?q=80&w=966&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt:     "Milkshake cremoso con toppings",
        reverse: false,
    },
    {
        tag:     "Clásico & Social",
        title:   "BEBIDAS ALCOCHOLICAS",
        desc:    "Disfruta nuestra selección de bebidas alcohólicas, desde la refrescante sangría hasta el vino hervido y la clásica cerveza, perfectas para acompañar y compartir buenos momentos.",
        img:     "https://plus.unsplash.com/premium_photo-1720776590072-c091c8dad645?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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