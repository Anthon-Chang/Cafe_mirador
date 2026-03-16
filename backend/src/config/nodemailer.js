import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// ===============================
// CONFIGURACIÓN GMAIL
// ===============================
const gmailConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
}


// ===============================
// CONFIGURACIÓN OUTLOOK
// ===============================
const outlookConfig = {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
    }
}

// ===============================
// SELECCIÓN DEL PROVEEDOR
// ===============================
const getTransportConfig = () => {

    switch (process.env.EMAIL_PROVIDER) {

        case "gmail":
            return gmailConfig

        case "outlook":
            return outlookConfig

        default:
            throw new Error(
                "EMAIL_PROVIDER inválido (usa gmail | outlook)"
            )
    }
}

// ===============================
// CREAR TRANSPORTER
// ===============================
const transporter = nodemailer.createTransport(
    getTransportConfig()
)

// ===============================
// FUNCIÓN PARA ENVIAR CORREOS
// ===============================
const sendMail = async (to, subject, html) => {

    try {

        const info = await transporter.sendMail({
            from: `"Café Mirador ☕" <${transporter.options.auth.user}>`,
            to,
            subject,
            html,
        })

        console.log("📨 Email enviado correctamente:", info.messageId)

        return info

    } catch (error) {

        console.error("❌ Error enviando email:", error.message)

        throw new Error("No se pudo enviar el correo")
    }
}

export default sendMail
