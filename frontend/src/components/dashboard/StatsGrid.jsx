import PropTypes from "prop-types"
import { FiTrendingUp, FiCalendar, FiDollarSign, FiClock } from "react-icons/fi"
import { StatCard } from "../ui/StatCard"
import { formatMoney } from "../../utils/formatters"

export function StatsGrid({ stats, loading }) {
    const CARDS = [
        {
            label:  "Ingresos del Día",
            value:  formatMoney(stats?.ingresosDia),
            sub:    `${stats?.pedidosDia ?? 0} pedidos hoy`,
            icon:   <FiTrendingUp className="text-5xl opacity-10 text-primary absolute top-3 right-3" />,
            color:  "text-primary",
            accent: "",
        },
        {
            label:  "Ingresos Semanales",
            value:  formatMoney(stats?.ingresosSemana),
            sub:    `${stats?.pedidosSemana ?? 0} pedidos esta semana`,
            icon:   <FiCalendar className="text-5xl opacity-10 text-green-400 absolute top-3 right-3" />,
            color:  "text-green-500",
            accent: "",
        },
        {
            label:  "Ingresos del Mes",
            value:  formatMoney(stats?.ingresosMes),
            sub:    `${stats?.pedidosMes ?? 0} pedidos este mes`,
            icon:   <FiDollarSign className="text-5xl opacity-10 text-secondary absolute top-3 right-3" />,
            color:  "text-secondary",
            accent: "border-b-4 border-b-secondary",
        },
        {
            label:  "Pedidos Activos",
            value:  String(stats?.pedidosActivos ?? 0),
            sub:    "En proceso ahora",
            icon:   <FiClock className="text-5xl opacity-10 text-primary absolute top-3 right-3" />,
            color:  "text-primary",
            accent: "",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARDS.map((card) => (
                <StatCard key={card.label} {...card} loading={loading} />
            ))}
        </div>
    )
}

StatsGrid.propTypes = {
    stats: PropTypes.shape({
        ingresosDia:     PropTypes.number,
        ingresosSemana:  PropTypes.number,
        ingresosMes:     PropTypes.number,
        pedidosDia:      PropTypes.number,
        pedidosSemana:   PropTypes.number,
        pedidosMes:      PropTypes.number,
        pedidosActivos:  PropTypes.number,
    }),
    loading: PropTypes.bool.isRequired,
}

StatsGrid.defaultProps = {
    stats: null,
}