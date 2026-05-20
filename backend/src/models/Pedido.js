import mongoose from "mongoose"

const itemPedidoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    nombre:    { type: String,  required: true },
    precio:    { type: Number,  required: true },
    cantidad:  { type: Number,  required: true, min: 1 },
    subtotal:  { type: Number,  required: true }
}, { _id: false })

const pedidoSchema = new mongoose.Schema({
    numeroPedido: {
        type: Number,
        unique: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default: null         // null = cliente en mostrador (sin cuenta)
    },
    nombreCliente: {
        type: String,
        trim: true,
        default: "Cliente mostrador"
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
        required: true        // trabajador/admin que lo registró
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