import { usePedidos }   from "../../hooks/usePedidos"
import { StatsGrid }    from "../../components/dashboard/StatsGrid"
import { PedidosTable } from "../../components/dashboard/PedidosTable"
import { ErrorAlert }   from "../../components/ui/ErrorAlert"

export function DashboardPage() {
    const {
        pedidos,
        stats,
        loadingPedidos,
        loadingStats,
        error,
        cambiando,
        cambiarEstado,
        eliminarPedido,
        clearError,
    } = usePedidos()

    return (
        <div className="space-y-8">

            <ErrorAlert message={error} onClose={clearError} />

            <StatsGrid stats={stats} loading={loadingStats} />

            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-sans text-xl font-extrabold tracking-tight text-slate-800">
                        Pedidos Activos
                    </h3>
                    {pedidos.length > 0 && (
                        <span className="bg-primary text-white text-xs font-sans font-bold px-2 py-0.5 rounded-full">
                            {pedidos.length}
                        </span>
                    )}
                </div>

                <PedidosTable
                    pedidos={pedidos}
                    loading={loadingPedidos}
                    cambiando={cambiando}
                    onCambiarEstado={cambiarEstado}
                    onEliminar={eliminarPedido}
                />
            </section>

        </div>
    )
}

export default DashboardPage