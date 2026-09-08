import PropTypes from "prop-types"
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { FiRefreshCw, FiTrendingUp } from "react-icons/fi"
import { formatMoney } from "../../utils/formatters"

const PRIMARY   = "#0ABAB5"
const SECONDARY = "#FAC213"
const GANANCIA  = "#22C55E"

const PERIODOS = [
    { valor: "dia",    label: "Día"    },
    { valor: "semana", label: "Semana" },
    { valor: "mes",    label: "Mes"    },
    { valor: "anio",   label: "Año"    },
]

function TooltipFinanzas({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-[#dbe6e6] rounded-xl shadow-lg px-4 py-3 space-y-1">
            <p className="font-sans text-xs text-slate-400 mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} className="font-sans font-bold text-sm" style={{ color: p.color }}>
                    {p.name}: {formatMoney(p.value)}
                </p>
            ))}
        </div>
    )
}
TooltipFinanzas.propTypes = { active: PropTypes.bool, payload: PropTypes.array, label: PropTypes.string }

export function GananciaChart({ periodo, onCambiarPeriodo, datos, loading }) {
    return (
        <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FiTrendingUp className="text-base" />
                    </div>
                    <div>
                        <h3 className="font-sans font-extrabold text-slate-800 text-base">
                            Ganancia (Ingresos vs Gastos)
                        </h3>
                        <p className="font-sans text-xs text-slate-400 mt-0.5">
                            Ingresos, gastos y ganancia neta por periodo
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-[#f5f8f8] border border-[#dbe6e6] rounded-xl p-1 shrink-0">
                    {PERIODOS.map(p => (
                        <button
                            key={p.valor}
                            onClick={() => onCambiarPeriodo(p.valor)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold transition-all ${
                                periodo === p.valor
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-slate-500 hover:text-primary"
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="w-full h-72 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
                    <FiRefreshCw className="text-2xl text-slate-300 animate-spin" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={datos} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f4" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={v => `$${v}`}
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                            width={55}
                        />
                        <Tooltip content={<TooltipFinanzas />} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: "Montserrat", fontSize: 12 }} />
                        <Bar dataKey="ingresos" name="Ingresos" fill={PRIMARY}   radius={[6, 6, 0, 0]} barSize={18} />
                        <Bar dataKey="gastos"   name="Gastos"   fill={SECONDARY} radius={[6, 6, 0, 0]} barSize={18} />
                        <Line
                            type="monotone"
                            dataKey="ganancia"
                            name="Ganancia neta"
                            stroke={GANANCIA}
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: GANANCIA, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

GananciaChart.propTypes = {
    periodo:          PropTypes.oneOf(["dia", "semana", "mes", "anio"]).isRequired,
    onCambiarPeriodo: PropTypes.func.isRequired,
    datos:            PropTypes.array,
    loading:          PropTypes.bool.isRequired,
}

GananciaChart.defaultProps = { datos: [] }