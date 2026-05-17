import PropTypes from "prop-types"

const CLIENTES = [
    {
        name:   "Stephen Ray Chapman",
        role:   "Hace un año",
        quote:  "Un lugar genial para comer y tomar un buen café antes o después de visitar el Pululahua. El personal es increíblemente amable. La próxima vez que esté en Quito, volveré.",
        rating: 5,
        color:  "bg-rose-400",
        img:    "https://lh3.googleusercontent.com/a-/ALV-UjWJWIDMjJnAG3qB6kRvXN9ADDeiQzOLdQdkcH2lb8oU54I7mKE=w45-h45-p-rp-mo-ba3-br100",
    },
    {
        name:   "Andrea Escobar",
        role:   "hace 1 mes",
        quote:  "El lugar ideal para disfrutar de un frapuccino y empanadas, toda la comida muy rica y con una presentación impecable! La atención y el ambiente son muy cálidos, además hay espacios con artesanías hermosas, totalmente recomendado para visitar!",
        rating: 5,
        color:  "bg-blue-400",
        img:    null,
    },
    {
        name:   "Michael Davis",
        role:   "hace 2 meses",
        quote:  "¡No encontrarás una mejor hamburguesa en las nubes en Quito! Prueba también el chocolate caliente y la empanada de viento, perfectas para calentar los huesos en las alturas.",
        rating: 5,
        color:  "bg-violet-400",
        img:    "https://lh3.googleusercontent.com/a-/ALV-UjUDI3JjYfNhgkIqx2AWb3rsvz1KEz_VM6vvunEhRl28jfc_T_E=w45-h45-p-rp-mo-ba2-br100",
    },
    {
        name:   "Damian Cortez",
        role:   "hace 3 semanas",
        quote:  "Lugar muy acogedor y servicio diferenciado con un menú idóneo para desconectar, cuentan con variadas artesanías y parqueadero.",
        rating: 5,
        color:  "bg-emerald-400",
        img:    "https://lh3.googleusercontent.com/a-/ALV-UjUvLGMRqMbKjPoe3i6Fx__X-Ms0Zt4qKiGowRK127rVvvQYZVk=w45-h45-p-rp-mo-br100",
    },
]

    const GoogleIcon = () => (
    <svg className="ml-auto w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
)

const getInitials = (name) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()

const Avatar = ({ name, img, color }) => {
    if (img) {
        return (
        <img src={img} alt={name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#D9D6D0] shrink-0" />
        )
    }
    return (
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
        <span className="text-white text-sm font-bold">{getInitials(name)}</span>
        </div>
    )
}

Avatar.propTypes = {
    name:  PropTypes.string.isRequired,
    img:   PropTypes.string,
    color: PropTypes.string.isRequired,
}

Avatar.defaultProps = {
    img: null,
}

export function ClientesTab() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {CLIENTES.map((c) => (
            <div key={c.name}
            className="group bg-white p-6 rounded-xl border border-[#D9D6D0] hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col gap-4">

            <div className="flex items-center gap-3">
                <Avatar name={c.name} img={c.img} color={c.color} />
                <div>
                <p className="font-bold text-sm text-[#111818]">{c.name}</p>
                <p className="text-xs text-gray-400">{c.role}</p>
                </div>
                <GoogleIcon />
            </div>

            <div className="flex gap-0.5">
                {Array.from({ length: c.rating }).map((_, i) => (
                <span key={i} className="text-[#FBBC05] text-base">★</span>
                ))}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed flex-1">{c.quote}</p>

            <div className="pt-4 border-t border-[#D9D6D0]/50">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Reseña de Google</span>
            </div>

            </div>
        ))}
        </div>
    )
}