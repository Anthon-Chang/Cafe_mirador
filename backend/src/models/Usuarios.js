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

    // ── Roles múltiples ──────────────────────────────────────────
    // Un usuario puede tener varios roles simultáneamente.
    // Ej: ['cliente', 'trabajador']
    roles: {
        type: [String],
        enum: ['superadmin', 'administrador', 'supervisor', 'trabajador', 'cliente'],
        default: ['cliente']
    },

    // ── rol (retrocompatibilidad) ────────────────────────────────
    // Mantiene el rol "dominante" para que el JWT y los middlewares
    // existentes sigan funcionando sin cambios.
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


// ── Hook pre-save: hash de password + sincronizar rol dominante ──
const JERARQUIA = ['cliente', 'trabajador', 'supervisor', 'administrador', 'superadmin'];

UsuarioSchema.pre('save', async function () {
    // 1. Hash del password si fue modificado
    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // 2. Sincronizar rol dominante cuando cambian los roles
    if (this.isModified('roles') || this.isNew) {
        const sorted = (this.roles ?? []).slice().sort(
            (a, b) => JERARQUIA.indexOf(b) - JERARQUIA.indexOf(a)
        );
        this.rol = sorted[0] ?? 'cliente';
    }
});


// ── Verificar password ───────────────────────────────────────────
UsuarioSchema.methods.matchPassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};


// ── Generar token ────────────────────────────────────────────────
UsuarioSchema.methods.generarToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.token = token;
    return token;
};


// ── Helper: tiene un rol específico ─────────────────────────────
UsuarioSchema.methods.tieneRol = function (rolBuscado) {
    return (this.roles ?? []).includes(rolBuscado);
};


export default model('Usuario', UsuarioSchema);