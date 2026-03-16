import sendMail from "../config/nodemailer.js"

// ===============================
// 📩 CONFIRMAR REGISTRO
// ===============================
const sendMailToRegister = (userMail, token, nombre) => {

    return sendMail(
        userMail,
        "Bienvenido a Café Mirador ☕✨",
        `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color:#6b4226;">¡Bienvenido a Café Mirador!</h1>
            <p>Hola ${nombre || ""}, gracias por registrarte en nuestra cafetería.</p>
            <p>Para comenzar a disfrutar de nuestros productos y beneficios exclusivos, confirma tu cuenta haciendo clic en el siguiente botón:</p>
            
            <a href="${process.env.URL_FRONTEND}confirm/${token}"
                style="display:inline-block; padding:10px 20px; background-color:#6b4226; color:white; text-decoration:none; border-radius:5px;">
                Confirmar cuenta
            </a>

            <hr>
            <footer style="margin-top:20px; font-size:12px; color:gray;">
                ☕ Café Mirador — Donde cada taza cuenta una historia.
            </footer>
        </div>
        `
    )
}


// ===============================
// 🔐 RECUPERAR CONTRASEÑA
// ===============================
const sendMailToRecoveryPassword = (userMail, token, nombre) => {

    return sendMail(
        userMail,
        "Recupera tu contraseña - Café Mirador ☕",
        `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color:#6b4226;">Café Mirador ☕</h1>
            <p>Hola ${nombre || ""}, hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

            <a href="${process.env.URL_FRONTEND}reset/${token}"
                style="display:inline-block; padding:10px 20px; background-color:#a0522d; color:white; text-decoration:none; border-radius:5px;">
                Restablecer contraseña
            </a>

            <p style="margin-top:15px;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>

            <hr>
            <footer style="margin-top:20px; font-size:12px; color:gray;">
                ☕ Café Mirador — Sabor, aroma y tradición.
            </footer>
        </div>
        `
    )
}


// ===============================
// 👤 ENVÍO DE CREDENCIALES (ADMIN CREA USUARIO)
// ===============================
const sendMailCredenciales = (userMail, password, nombre) => {

    return sendMail(
        userMail,
        "Tus credenciales de acceso - Café Mirador ☕",
        `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color:#6b4226;">Bienvenido a Café Mirador</h1>
            <p>Hola ${nombre || ""}, tu cuenta ha sido creada exitosamente.</p>
            <p>A continuación, tus credenciales de acceso:</p>

            <p><strong>Email:</strong> ${userMail}</p>
            <p><strong>Contraseña:</strong> ${password}</p>

            <a href="${process.env.URL_FRONTEND}login"
                style="display:inline-block; padding:10px 20px; background-color:#6b4226; color:white; text-decoration:none; border-radius:5px;">
                Iniciar sesión
            </a>

            <hr>
            <footer style="margin-top:20px; font-size:12px; color:gray;">
                ☕ Café Mirador — Gracias por formar parte de nuestra familia.
            </footer>
        </div>
        `
    )
}


export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailCredenciales
}
