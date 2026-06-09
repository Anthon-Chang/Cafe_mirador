// frontend/src/pages/admin/AnaliticasPage.jsx
import PropTypes                            from "prop-types"
import { useState, useEffect, useCallback } from "react"
import {
    AreaChart, Area,
    BarChart,  Bar,
    PieChart,  Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from "recharts"
import { FiRefreshCw, FiTrendingUp, FiPieChart, FiBarChart2, FiClock } from "react-icons/fi"
import { pedidosService } from "../../services/pedidosService"
import { formatMoney }    from "../../utils/formatters"

// ─── Tokens de color del proyecto ────────────────────────────────────────────
const PRIMARY   = "#0ABAB5"
const SECONDARY = "#FAC213"

const COLOR_ESTADO = {
    pendiente:  "#F59E0B",
    procesando: PRIMARY,
    completado: "#22C55E",
    cancelado:  "#EF4444",
}

const COLOR_METODO = {
    efectivo:      PRIMARY,
    tarjeta:       SECONDARY,
    transferencia: "#8B5CF6",
}

// ─── Tooltip personalizado (área e ingresos) ──────────────────────────────────
function TooltipIngresos({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-[#dbe6e6] rounded-xl shadow-lg px-4 py-3">
            <p className="font-sans text-xs text-slate-400 mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} className="font-sans font-bold text-sm"
                   style={{ color: p.color }}>
                    {p.name === "Ingresos"
                        ? formatMoney(p.value)
                        : `${p.value} pedidos`
                    }
                </p>
            ))}
        </div>
    )
}

TooltipIngresos.propTypes = {
    active:  PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({
        dataKey: PropTypes.string,
        name:    PropTypes.string,
        value:   PropTypes.number,
        color:   PropTypes.string,
    })),
    label: PropTypes.string,
}

// ─── Tooltip de horas ─────────────────────────────────────────────────────────
function TooltipHora({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-[#dbe6e6] rounded-xl shadow-lg px-4 py-3">
            <p className="font-sans text-xs text-slate-400 mb-1">{label}</p>
            <p className="font-sans font-bold text-sm text-primary">
                {payload[0]?.value} pedidos
            </p>
        </div>
    )
}

TooltipHora.propTypes = {
    active:  PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number })),
    label:   PropTypes.string,
}

// ─── Tooltip de estados ───────────────────────────────────────────────────────
function TooltipEstado({ active, payload }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-[#dbe6e6] rounded-xl shadow-lg px-4 py-3">
            <p className="font-sans text-xs text-slate-400 mb-1">{payload[0]?.payload?.label}</p>
            <p className="font-sans font-bold text-sm" style={{ color: payload[0]?.fill }}>
                {payload[0]?.value} pedidos
            </p>
        </div>
    )
}

TooltipEstado.propTypes = {
    active:  PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({
        fill:    PropTypes.string,
        value:   PropTypes.number,
        payload: PropTypes.shape({ label: PropTypes.string }),
    })),
}

// ─── Label custom para PieChart ───────────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
              fontSize={12} fontWeight={700} fontFamily="Montserrat, sans-serif">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

// ─── Skeleton de carga ────────────────────────────────────────────────────────
function ChartSkeleton() {
    return (
        <div className="w-full h-64 rounded-xl bg-slate-100 animate-pulse flex items-center
                         justify-center">
            <FiRefreshCw className="text-2xl text-slate-300 animate-spin" />
        </div>
    )
}

// ─── Tarjeta contenedora de cada gráfica ─────────────────────────────────────
function ChartCard({ title, subtitle, icon, children, loading }) {
    return (
        <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="font-sans font-extrabold text-slate-800 text-base">
                        {title}
                    </h3>
                    <p className="font-sans text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center
                                 justify-center text-primary shrink-0">
                    {icon}
                </div>
            </div>
            {loading ? <ChartSkeleton /> : children}
        </div>
    )
}

ChartCard.propTypes = {
    title:    PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    icon:     PropTypes.node.isRequired,
    children: PropTypes.node,
    loading:  PropTypes.bool.isRequired,
}

ChartCard.defaultProps = {
    children: null,
}

// ─── KPI rápido ───────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }) {
    return (
        <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm px-5 py-4">
            <p className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className={`font-sans text-2xl font-black ${color ?? "text-slate-800"}`}>
                {value}
            </p>
            {sub && (
                <p className="font-sans text-xs text-slate-400 mt-0.5">{sub}</p>
            )}
        </div>
    )
}

KpiCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    sub:   PropTypes.string,
    color: PropTypes.string,
}

KpiCard.defaultProps = {
    sub:   null,
    color: null,
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function AnaliticasPage() {
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState(null)

    const cargar = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await pedidosService.getAnaliticas()
            setData(res)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { cargar() }, [cargar])

    // ── KPIs derivados ────────────────────────────────────────────
    const totalIngresos30 = data?.ingresosDiarios.reduce((a, d) => a + d.ingresos, 0) ?? 0
    const totalPedidos30  = data?.ingresosDiarios.reduce((a, d) => a + d.pedidos,  0) ?? 0
    const ticketPromedio  = totalPedidos30 > 0 ? totalIngresos30 / totalPedidos30 : 0
    const completados     = data?.porEstado.find(e => e.estado === "completado")?.total ?? 0
    const cancelados      = data?.porEstado.find(e => e.estado === "cancelado")?.total  ?? 0
    const tasaComplecion  = totalPedidos30 > 0
        ? `${((completados / totalPedidos30) * 100).toFixed(0)}%`
        : "—"

    // Hora pico (la que tiene más pedidos)
    const horaPico = data?.porHora.reduce((max, h) =>
        h.pedidos > (max?.pedidos ?? 0) ? h : max, null
    )

    return (
        <div className="space-y-6">

            {/* ── Cabecera ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-800">
                        Analíticas
                    </h1>
                    <p className="font-sans text-sm text-slate-400 mt-1">
                        Últimos 30 días · Pedidos completados
                    </p>
                </div>
                <button
                    onClick={cargar}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dbe6e6]
                               text-slate-600 font-sans font-semibold text-sm hover:bg-slate-50
                               transition-colors disabled:opacity-50 self-start sm:self-auto"
                >
                    <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3
                                font-sans text-sm text-red-600">
                    {error} —{" "}
                    <button onClick={cargar} className="underline font-semibold">
                        reintentar
                    </button>
                </div>
            )}

            {/* ── KPIs ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    label="Ingresos 30 días"
                    value={loading ? "..." : formatMoney(totalIngresos30)}
                    sub={`${totalPedidos30} pedidos completados`}
                    color="text-primary"
                />
                <KpiCard
                    label="Ticket promedio"
                    value={loading ? "..." : formatMoney(ticketPromedio)}
                    sub="por pedido completado"
                    color="text-slate-800"
                />
                <KpiCard
                    label="Tasa de completados"
                    value={loading ? "..." : tasaComplecion}
                    sub={`${cancelados} cancelados`}
                    color="text-green-600"
                />
                <KpiCard
                    label="Hora pico"
                    value={loading ? "..." : (horaPico?.pedidos ? horaPico.label : "—")}
                    sub={horaPico?.pedidos ? `${horaPico.pedidos} pedidos` : "sin datos"}
                    color="text-secondary"
                />
            </div>

            {/* ── Fila 1: AreaChart a todo el ancho ── */}
            <ChartCard
                title="Ingresos diarios"
                subtitle="Últimos 30 días — pedidos completados"
                icon={<FiTrendingUp className="text-base" />}
                loading={loading}
            >
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart
                        data={data?.ingresosDiarios}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={PRIMARY} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={PRIMARY} stopOpacity={0}    />
                            </linearGradient>
                            <linearGradient id="gradPedidos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={SECONDARY} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={SECONDARY} stopOpacity={0}    />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f4" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                            interval={4}
                        />
                        <YAxis
                            yAxisId="ingresos"
                            orientation="left"
                            tickFormatter={v => `$${v}`}
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                            width={55}
                        />
                        <YAxis
                            yAxisId="pedidos"
                            orientation="right"
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Tooltip content={<TooltipIngresos />} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontFamily: "Montserrat", fontSize: 12 }}
                        />
                        <Area
                            yAxisId="ingresos"
                            type="monotone"
                            dataKey="ingresos"
                            name="Ingresos"
                            stroke={PRIMARY}
                            strokeWidth={2.5}
                            fill="url(#gradIngresos)"
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <Area
                            yAxisId="pedidos"
                            type="monotone"
                            dataKey="pedidos"
                            name="Pedidos"
                            stroke={SECONDARY}
                            strokeWidth={2}
                            fill="url(#gradPedidos)"
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Fila 2: BarChart + PieChart ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BarChart — pedidos por estado */}
                <ChartCard
                    title="Pedidos por estado"
                    subtitle="Últimos 30 días — todos los estados"
                    icon={<FiBarChart2 className="text-base" />}
                    loading={loading}
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={data?.porEstado}
                            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                            barSize={36}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f4" vertical={false} />
                            <XAxis
                                dataKey="label"
                                tick={{ fontFamily: "Montserrat", fontSize: 11, fill: "#94a3b8" }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<TooltipEstado />} cursor={{ fill: "#f5f8f8" }} />
                            <Bar dataKey="total" name="Pedidos" radius={[6, 6, 0, 0]}>
                                {data?.porEstado.map(entry => (
                                    <Cell
                                        key={entry.estado}
                                        fill={COLOR_ESTADO[entry.estado] ?? PRIMARY}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* PieChart — métodos de pago */}
                <ChartCard
                    title="Métodos de pago"
                    subtitle="Últimos 30 días — pedidos completados"
                    icon={<FiPieChart className="text-base" />}
                    loading={loading}
                >
                    {data?.porMetodoPago.every(m => m.total === 0) ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-2">
                            <p className="font-sans text-sm text-slate-400">Sin datos de pago aún</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={data?.porMetodoPago}
                                    dataKey="total"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={95}
                                    innerRadius={50}
                                    labelLine={false}
                                    label={renderPieLabel}
                                    paddingAngle={3}
                                >
                                    {data?.porMetodoPago.map(entry => (
                                        <Cell
                                            key={entry.metodo}
                                            fill={COLOR_METODO[entry.metodo] ?? "#cbd5e1"}
                                        />
                                    ))}
                                </Pie>
                                <PieTooltip
                                    formatter={(value, name) => [`${value} pedidos`, name]}
                                    contentStyle={{
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: 12,
                                        borderRadius: 12,
                                        border: "1px solid #dbe6e6",
                                    }}
                                />
                                <PieLegend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontFamily: "Montserrat", fontSize: 12 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>

            {/* ── Fila 3: LineChart — pedidos por hora ── */}
            <ChartCard
                title="Pedidos por hora del día"
                subtitle="Últimos 7 días — muestra las horas pico del café"
                icon={<FiClock className="text-base" />}
                loading={loading}
            >
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart
                        data={data?.porHora}
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f4" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                            interval={2}
                        />
                        <YAxis
                            tick={{ fontFamily: "Montserrat", fontSize: 10, fill: "#94a3b8" }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip content={<TooltipHora />} />
                        <Line
                            type="monotone"
                            dataKey="pedidos"
                            name="Pedidos"
                            stroke={PRIMARY}
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: PRIMARY, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

        </div>
    )
}

export default AnaliticasPage