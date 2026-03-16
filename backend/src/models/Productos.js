// models/Producto.js
import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true,
        trim:true
    },
    descripcion: { 
        type: String,
        trim:true 
    },
    precio: { 
        type: Number, 
        required: true, 
        trim:true
    },
    imagen: { 
        type: String,
        trim:true 
    }, 
    imagenID: { 
        type: String,
        trim:true 
    },
    categoria: { 
        type: String,
        trim:true
    },
    
}, { timestamps: true });

export default mongoose.model("Producto", productoSchema);
