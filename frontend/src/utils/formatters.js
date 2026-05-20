// ── Moneda ─────────────────────────────────────────────────────────
export const formatMoney = (n) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(n ?? 0)

// ── Hora ───────────────────────────────────────────────────────────
export const formatHora = (iso) =>
    new Date(iso).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })

// ── Fecha completa ─────────────────────────────────────────────────
export const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" })

// ── Capitalizar ────────────────────────────────────────────────────
export const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : ""

// ── Nombre completo ────────────────────────────────────────────────
export const nombreCompleto = (usuario) =>
    usuario ? `${usuario.nombre} ${usuario.apellido}` : ""