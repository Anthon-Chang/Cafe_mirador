import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        default: null
    },
    cedula: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    celular: {
        type: String,
        trim: true,
        default: null
    },
    direccion: {
        type: String,
        trim: true,
        default: null
    },
    rol: {
        type: String,
        enum: ['superadmin', 'administrador', 'supervisor', 'trabajador', 'cliente'],
        default: 'cliente'
    },
    status: {
        type: Boolean,
        default: true
    },
    confirmarEmail: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});


// 🔐 Hash del password
UsuarioSchema.pre('save', async function () {

    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// 🔑 Verificar password
UsuarioSchema.methods.matchPassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};


// 🎟 Generar token
UsuarioSchema.methods.generarToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.token = token;
    return token;
};


export default model('Usuario', UsuarioSchema);
