export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const STATUS_CONFIG = {
    pendiente:  { label: "Pendiente",  classes: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" },
    procesando: { label: "Procesando", classes: "bg-primary/10 text-primary border border-primary/20"          },
    completado: { label: "Completado", classes: "bg-green-500/10 text-green-500 border border-green-500/20"    },
    cancelado:  { label: "Cancelado",  classes: "bg-red-500/10 text-red-500 border border-red-500/20"          },
}

export const ROLES_ADMIN = ["superadmin", "administrador", "supervisor", "trabajador"]