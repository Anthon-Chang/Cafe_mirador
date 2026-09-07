import {v2 as cloudinary} from "cloudinary"
import fs from "fs-extra"

// subir imagen a cloudinary
const subirImagenCloudinary = async (filePath, folder = "Productos") => {

    const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, { folder})
    await fs.unlink(filePath) // eliminar imagen del servidor
    return { secure_url, public_id }
}

// subir Base64 a cloudinary
const subirBase64Cloudinary = async (base64String, folder = "Productos") => {

    const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""), "base64")
    const { secure_url } = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (err, res) => {
        if (err) reject(err);
        else resolve(res);
    })
    stream.end(buffer)
})
    return secure_url
} 

// borrar/reemplazar la foto de perfil
const subirBase64ConIdCloudinary = async (base64String, folder = "Perfiles") => {
    const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""), "base64")
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
        stream.end(buffer)
    })
    return { secure_url: result.secure_url, public_id: result.public_id }
}

export {
    subirImagenCloudinary,
    subirBase64Cloudinary,
    subirBase64ConIdCloudinary
}