import mongoose from "mongoose"

const CATEGORIAS_GASTO = [
    "Servicios Básicos",
    "Sueldos",
    "Insumos",
    "Arriendo",
    "Mantenimiento",
    "Impuestos",
    "Marketing",
    "Otro"
]

const gastoSchema = new mongoose.Schema({
    concepto: {
        type: String,
        required: true,
        trim: true
    },
    monto: {
        type: Number,
        required: true,
        min: 0.01
    },
    categoria: {
        type: String,
        enum: CATEGORIAS_GASTO,
        default: "Otro"
    },
    tipo: {
        type: String,
        enum: ["fijo", "ocasional"],
        required: true
    },
    // "ocasional": fecha exacta del gasto.
    // "fijo": fecha en que empieza a repetirse — el día del mes marca el día de cobro mensual.
    fechaInicio: {
        type: Date,
        required: true
    },
    // "fijo": al desactivarse se guarda cuándo dejó de aplicar.
    // Los meses anteriores a fechaFin se siguen contando en el histórico.
    fechaFin: {
        type: Date,
        default: null
    },
    // "fijo": si sigue repitiéndose cada mes. "ocasional": siempre true.
    activo: {
        type: Boolean,
        default: true
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }
}, { timestamps: true })

export const CATEGORIAS = CATEGORIAS_GASTO
export default mongoose.model("Gasto", gastoSchema)