
    const HELADOS = [
    {
        tag:     "HELADOS ARTESANALES",
        title:   "CONOS Y COPAS",
        desc:    "Disfruta de nuestros helados artesanales servidos en crujientes conos o en elegantes copas. Elaborados con ingredientes naturales y sabores únicos que van desde el clásico vainilla hasta exóticas combinaciones de frutas tropicales. Cada porción es una explosión de frescura y sabor.",
        img:     "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80",
        alt:     "Conos y copas de helado artesanal",
        reverse: false,
    },
    {
        tag:     "WAFFLES",
        title:   "WAFFLES",
        desc:    "Nuestros waffles son preparados al momento con masa fresca y acompañados de helado artesanal, frutas frescas, siropes naturales y crema batida. La combinación perfecta entre lo caliente y lo frío para una experiencia única e irresistible.",
        img:     "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80",
        alt:     "Waffles con helado y frutas",
        reverse: true,
    },
    {
        tag:     "CREPPES",
        title:   "CREPPES",
        desc:    "Nuestras crêpes son preparadas al momento con masa fresca y rellenas de helado artesanal, frutas frescas, siropes naturales y crema batida. La combinación perfecta entre lo caliente y lo frío para una experiencia única e irresistible.",
        img:     "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80",
        alt:     "Crêpes con helado y frutas",
        reverse: false,
    }
    ]

    // ── Componente ─────────────────────────────────────────────────────────────
    export function Heladeria() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8 lg:py-12">

            {/* Hero title */}
            <div className="mb-16">
            <h1 className="text-primary text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                Heladeria Artesanal
            </h1>
            <p className="text-lg text-[#8c815f] max-w-2xl leading-relaxed">
                Explora nuestra cuidadosa selección de granos de especialidad, mezclas artesanales y
                preparaciones únicas diseñadas para despertar tus sentidos.
            </p>
            </div>

            {/* Categorías zigzag */}
            <div className="space-y-24">
            {HELADOS.map((b) => (
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