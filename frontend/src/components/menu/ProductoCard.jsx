import PropTypes from "prop-types"
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi"
import { formatMoney } from "../../utils/formatters"

export function ProductoCard({ producto, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
            {/* Imagen */}
            <div className="relative h-44 bg-slate-100 overflow-hidden">
                {producto.imagen ? (
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FiImage className="text-4xl" />
                    </div>
                )}

                {/* Badge disponibilidad */}
                <span className={`absolute top-3 left-3 text-xs font-sans font-semibold px-2.5 py-1 rounded-full border ${
                    producto.disponible !== false
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-red-50 text-red-500 border-red-200"
                }`}>
                    {producto.disponible !== false ? "Disponible" : "No disponible"}
                </span>

                {/* Acciones hover */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(producto)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
                        title="Editar"
                    >
                        <FiEdit2 className="text-sm" />
                    </button>
                    <button
                        onClick={() => onDelete(producto)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                        title="Eliminar"
                    >
                        <FiTrash2 className="text-sm" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-sans font-bold text-slate-800 text-sm leading-tight flex-1 line-clamp-1">
                        {producto.nombre}
                    </h4>
                    <span className="font-sans font-extrabold text-primary text-sm whitespace-nowrap">
                        {formatMoney(producto.precio)}
                    </span>
                </div>
                {producto.descripcion && (
                    <p className="text-xs font-sans text-slate-400 line-clamp-2 mb-3">
                        {producto.descripcion}
                    </p>
                )}
                {producto.categoria && (
                    <span className="inline-block text-xs font-sans font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {producto.categoria}
                    </span>
                )}
            </div>
        </div>
    )
}

ProductoCard.propTypes = {
    producto: PropTypes.shape({
        _id:         PropTypes.string.isRequired,
        nombre:      PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        precio:      PropTypes.number.isRequired,
        imagen:      PropTypes.string,
        categoria:   PropTypes.string,
        disponible:  PropTypes.bool,
    }).isRequired,
    onEdit:   PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}