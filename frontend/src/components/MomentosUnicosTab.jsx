
const MOMENTOS_UNICOS = [
    {
        title: "Primer Instante",
        desc:  "Comienza tu día sin prisa, rodeado de naturaleza y vistas que inspiran. Un espacio pensado para reconectar contigo desde el primer momento.",
        tag:   "Saborea la calma",
        img:   "https://images.unsplash.com/photo-1677846092922-5b685ba0afb2?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Tardes Acogedoras",
        desc:  "Refúgiate del frío y la lluvia con bebidas calientes, buena compañía y un ambiente acogedor que invita a quedarte un poco más.",
        tag:   "Encuentra tu rincón",
        img:   "https://plus.unsplash.com/premium_photo-1679088033159-f799df376442?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Enfoque Tranquilo",
        desc:  "Un espacio pensado para concentrarte: conexión estable, ambiente silencioso y la calma perfecta para trabajar o crear sin distracciones.",
        tag:   "Conecta y crea",
        img:   "https://images.unsplash.com/photo-1589988449463-5ba7b298db2b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Sabor & Detalle",
        desc:  "Disfruta sabores artesanales que acompañan cada momento. Entre café, postres y detalles únicos, cada visita se vuelve especial.",
        tag:   "Date un gusto",
        img:   "https://images.unsplash.com/photo-1600007525237-3ffb936cd20f?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
]

export function MomentosUnicosTab() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOMENTOS_UNICOS.map((exp) => (
            <div key={exp.title}
            className="group bg-white p-5 rounded-xl border border-[#D9D6D0] hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="relative aspect-4/5 rounded-lg mb-6 overflow-hidden bg-gray-100">
                <img src={exp.img} alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">{exp.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{exp.desc}</p>
            <div className="mt-6 pt-4 border-t border-[#D9D6D0]/50">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest">{exp.tag}</span>
            </div>
            </div>
        ))}
        </div>
    )
}