import mongoose from "mongoose"

const itemPedidoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    nombre:   { type: String, required: true },
    precio:   { type: Number, required: true },
    cantidad: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true }
}, { _id: false })

const pedidoSchema = new mongoose.Schema({
    numeroPedido: {
        type: Number,
        unique: true
    },

    // ── Referencia al documento Usuario ────────────────────────
    // null = consumidor final sin cuenta registrada
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default: null
    },

    // ── Snapshot histórico de datos del cliente ─────────────────
    // Se guardan en el pedido para mantener el registro aunque
    // el usuario cambie sus datos o sea eliminado posteriormente.
    nombreCliente: { type: String, trim: true, default: "Consumidor Final" },
    cedula:        { type: String, trim: true, default: null },
    celular:       { type: String, trim: true, default: null },
    direccion:     { type: String, trim: true, default: null },
    email:         { type: String, trim: true, default: null },
    metodoPago:    {
        type: String,
        enum: ["efectivo", "tarjeta", "transferencia"],
        default: "efectivo"
    },

    items: [itemPedidoSchema],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ["pendiente", "procesando", "completado", "cancelado"],
        default: "pendiente"
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }
}, { timestamps: true })

// Auto-incrementar numeroPedido
pedidoSchema.pre("save", async function () {
    if (this.isNew) {
        const ultimo = await mongoose.model("Pedido").findOne().sort({ numeroPedido: -1 })
        this.numeroPedido = ultimo ? ultimo.numeroPedido + 1 : 1
    }
})

export default mongoose.model("Pedido", pedidoSchema)