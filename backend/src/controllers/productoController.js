import Producto from "../models/Productos.js"
import mongoose from "mongoose"
import { subirImagenCloudinary, subirBase64Cloudinary } from "../helpers/uploadCloudinary.js"
import { v2 as cloudinary } from "cloudinary"

// ===============================
// CREAR PRODUCTO
// ===============================
const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria } = req.body

        if (!nombre || !precio || !categoria)
            return res.status(400).json({ msg: "Nombre, precio y categoría son obligatorios" })

        if (precio <= 0)
            return res.status(400).json({ msg: "El precio debe ser mayor a 0" })

        const productoExistente = await Producto.findOne({ nombre })
        if (productoExistente)
            return res.status(400).json({ msg: "Ya existe un producto con ese nombre" })

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            categoria
        })

        // Imagen desde file (multer)
        if (req.files?.imagen) {
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            nuevoProducto.imagen = secure_url
            nuevoProducto.imagenID = public_id
        }

        // Imagen Base64 (React)
        if (req.body?.imagenBase64) {
            const secure_url = await subirBase64Cloudinary(req.body.imagenBase64)
            nuevoProducto.imagen = secure_url
        }

        await nuevoProducto.save()

        res.status(201).json({
            msg: "Producto creado correctamente",
            producto: nuevoProducto
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// LISTAR PRODUCTOS
// ===============================
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find()
            .select("-__v -createdAt -updatedAt")

        res.status(200).json(productos)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// DETALLE PRODUCTO
// ===============================
const detalleProducto = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ msg: "ID no válido" })

        const producto = await Producto.findById(id)

        if (!producto)
            return res.status(404).json({ msg: "Producto no encontrado" })

        res.status(200).json(producto)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ACTUALIZAR PRODUCTO
// ===============================
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const producto = await Producto.findById(id)
        if (!producto)
            return res.status(404).json({ msg: "Producto no encontrado" })

        if (req.body.precio !== undefined && req.body.precio <= 0)
            return res.status(400).json({ msg: "El precio debe ser mayor a 0" })

        // Si envían nueva imagen tipo file
        if (req.files?.imagen) {

            // Eliminar imagen anterior si existe
            if (producto.imagenID) {
                await cloudinary.uploader.destroy(producto.imagenID)
            }

            const { secure_url, public_id } =
                await subirImagenCloudinary(req.files.imagen.tempFilePath)

            req.body.imagen = secure_url
            req.body.imagenID = public_id
        }

        // Si envían imagen Base64
        if (req.body?.imagenBase64) {

            if (producto.imagenID) {
                await cloudinary.uploader.destroy(producto.imagenID)
            }

            const secure_url =
                await subirBase64Cloudinary(req.body.imagenBase64)

            req.body.imagen = secure_url
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            req.body,
            { returnDocument: 'after' }
        )

        res.status(200).json({
            msg: "Producto actualizado correctamente",
            producto: productoActualizado
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ELIMINAR PRODUCTO
// ===============================
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ msg: "ID no válido" })

        const producto = await Producto.findById(id)
        if (!producto)
            return res.status(404).json({ msg: "Producto no encontrado" })

        // Eliminar imagen en Cloudinary si existe
        if (producto.imagenID) {
            await cloudinary.uploader.destroy(producto.imagenID)
        }

        await Producto.findByIdAndDelete(id)

        res.status(200).json({ msg: "Producto eliminado correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

export {
    crearProducto,
    obtenerProductos,
    detalleProducto,
    actualizarProducto,
    eliminarProducto
}