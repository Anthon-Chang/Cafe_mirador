import PropTypes from "prop-types"
import { FiMoreHorizontal, FiCheck, FiSlash, FiRefreshCw, FiTrash2 } from "react-icons/fi"
import { StatusBadge } from "../ui/StatusBadge"
import { formatMoney, formatHora } from "../../utils/formatters"

const HEADERS = ["# Pedido", "Cliente", "Productos", "Total", "Hora", "Estado", "Acciones"]

function EmptyState() {
    return (
        <div className="p-12 text-center">
            <FiCheck className="text-4xl text-green-400 mx-auto mb-3" />
            <p className="font-sans font-semibold text-slate-700">¡Todo al día!</p>
            <p className="text-sm font-sans text-slate-400 mt-1">
                No hay pedidos activos en este momento.
            </p>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="p-12 text-center">
            <FiRefreshCw className="text-2xl text-slate-400 animate-spin mx-auto mb-2" />
            <p className="text-sm font-sans text-slate-500">Cargando pedidos...</p>
        </div>
    )
}

function AccionesPedido({ pedido, enCambio, onCambiarEstado, onEliminar }) {
    return (
        <div className="flex items-center gap-2">
            {pedido.estado === "pendiente" && (
                <button
                    onClick={() => onCambiarEstado(pedido._id, "procesando")}
                    disabled={enCambio}
                    title="Marcar como procesando"
                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                    <FiMoreHorizontal className="text-sm" />
                </button>
            )}
            <button
                onClick={() => onCambiarEstado(pedido._id, "completado")}
                disabled={enCambio}
                title="Completar pedido"
                className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
                {enCambio
                    ? <FiRefreshCw className="text-sm animate-spin" />
                    : <FiCheck className="text-sm" />
                }
            </button>
            <button
                onClick={() => onCambiarEstado(pedido._id, "cancelado")}
                disabled={enCambio}
                title="Cancelar pedido"
                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
                <FiSlash className="text-sm" />
            </button>
            <button
                onClick={() => onEliminar(pedido._id)}
                disabled={enCambio}
                title="Eliminar pedido"
                className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
            >
                <FiTrash2 className="text-sm" />
            </button>
        </div>
    )
}

AccionesPedido.propTypes = {
    pedido: PropTypes.shape({
        _id:    PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
    enCambio:        PropTypes.bool.isRequired,
    onCambiarEstado: PropTypes.func.isRequired,
    onEliminar:      PropTypes.func.isRequired,
}

export function PedidosTable({ pedidos, loading, cambiando, onCambiarEstado, onEliminar }) {
    if (loading)          return <div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><LoadingState /></div>
    if (!pedidos.length)  return <div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><EmptyState /></div>

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {HEADERS.map((th) => (
                                <th
                                    key={th}
                                    className="px-6 py-4 text-xs font-sans font-bold text-slate-500 uppercase tracking-widest"
                                >
                                    {th}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {pedidos.map((pedido) => (
                            <tr key={pedido._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-sans font-bold text-slate-800">
                                    #{pedido.numeroPedido}
                                </td>
                                <td className="px-6 py-4 text-sm font-sans text-slate-600">
                                    {pedido.nombreCliente}
                                </td>
                                <td className="px-6 py-4 text-sm font-sans text-slate-500 italic max-w-50 truncate">
                                    {pedido.items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")}
                                </td>
                                <td className="px-6 py-4 text-sm font-sans font-bold text-slate-800">
                                    {formatMoney(pedido.total)}
                                </td>
                                <td className="px-6 py-4 text-sm font-sans text-slate-400">
                                    {formatHora(pedido.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge estado={pedido.estado} />
                                </td>
                                <td className="px-6 py-4">
                                    <AccionesPedido
                                        pedido={pedido}
                                        enCambio={cambiando === pedido._id}
                                        onCambiarEstado={onCambiarEstado}
                                        onEliminar={onEliminar}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

PedidosTable.propTypes = {
    pedidos:         PropTypes.array.isRequired,
    loading:         PropTypes.bool.isRequired,
    cambiando:       PropTypes.string,
    onCambiarEstado: PropTypes.func.isRequired,
    onEliminar:      PropTypes.func.isRequired,
}

PedidosTable.defaultProps = {
    cambiando: null,
}