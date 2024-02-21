import { Request, Response, NextFunction } from "express";
import usuarioService from "../servicios/usuario.service.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import nodemailer from 'nodemailer';
import { templateHtml } from "../../lib/utils.js";

async function login(req: Request, res: Response) {

    // Si ya inicio sesion (el JWT viene en la cookie). Veririco que el JWT sea valido
    if (req.cookies?.token) {

        try {
            const usuario = usuarioService.verifyJWT(req.cookies.token);
            return res.status(200).json(usuario);

        } catch (error) {
            // Si el JWT no es valido, lo elimino de la cookie y retorno un error
            res.clearCookie('token');
            return res.status(401).json({ error: 'Token expirado o no valido' });
        }
    }

    // Si no inicio sesion (el JWT no viene en la cookie)
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) return res.status(400).json({ error: 'Datos incompletos' });

    try {
        const usuario = await usuarioService.login(correo, contrasena);
        // Guardo el JWT en la cookie (2 dias de duracion)
        res.cookie('token', usuario.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
        return res.status(200).json(usuario);

    } catch (error) {
        // Error de correo sin formato o inexistente o contrasena incorrecta
        if (error instanceof InvalidValueError) return res.status(404).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function loginProvider(req: Request, res: Response) {

    // Si ya inicio sesion (el JWT viene en la cookie). Veririco que el JWT sea valido
    if (req.cookies?.token) {

        try {
            const usuario = usuarioService.verifyJWT(req.cookies.token);
            return res.status(200).json(usuario);

        } catch (error) {
            // Si el JWT no es valido, lo elimino de la cookie y retorno un error
            res.clearCookie('token');
            return res.status(401).json({ error: 'Token expirado o no valido' });
        }
    }

    // Si no inicio sesion (el JWT no viene en la cookie)
    const { nombre, correo } = req.body;
    const { provider } = req.params;

    if (!nombre || !correo || !provider) return res.status(400).json({ error: 'Faltan campos obligatorios' });

    try {
        const usuario = await usuarioService.loginProvider(provider, nombre, correo);
        // Guardo el JWT en la cookie (2 dias de duracion)
        res.cookie('token', usuario.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({ error: "Error al iniciar sesion con el proveedor" });
    }

}

async function logout(req: Request, res: Response) {
    // Elimino el JWT de la cookie
    res.clearCookie('token');
    return res.status(204).send();
}

async function resetPassword(req: Request, res: Response) {

    const correo = req.body.correo;

    if (!correo) return res.status(400).json({error: 'Datos incompletos'});

    try {
        const user = await usuarioService.getUsuarioByCorreo(correo);
        const token = usuarioService.generateResetJWT(user);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });

        let mail = {
            from: process.env.MAIL_USERNAME,
            to: user.correo,
            subject: 'FlipBoard: Reestablecer contraseña',
            html: templateHtml(`Para reestablecer tu contraseña, hace click <a href="${process.env.FRONTEND_URL}/reset-password/${token}/${user.id}">en este enlace</a>.`)
        }

        transporter.sendMail(mail, (error, body) => {
            if (error) return res.status(400).json({ error: error.message });
            return res.status(204).send();
        });


    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

// middleware to verify JWT
async function authentication(req: Request, res: Response, next: NextFunction) {

    // rutas que no requieren autenticacion
    const rutasSinAuth = ["/api-docs", "/api/auth/login", "/api/auth/google/login", "/api/auth/reset-password", "/api/usuarios"]

    // si la ruta no requiere autenticacion, continuo
    if (rutasSinAuth.includes(req.path)) return next()

    // patrones de rutas mas especificas que no requieren autenticacion
    if (req.path.startsWith("/api/usuarios") && req.path.endsWith("/password")) return next()

    // get jwt from header
    const token = req.header('Authorization');

    if (token) {
        try {
            usuarioService.verifyJWT(token);
            return next();
        } catch (error) {
            res.clearCookie('token');
            return res.status(401).json({ error: 'Token expirado o no valido' });
        }
    }
    return res.status(401).json({ error: 'No autorizado' });
}


export default { login, logout, resetPassword, loginProvider, authentication };