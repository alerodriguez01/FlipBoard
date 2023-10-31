import { Request, Response } from "express";
import usuarioService from "../servicios/usuario.service.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import nodemailer from 'nodemailer';

async function login(req: Request, res: Response) {
    
    // Si ya inicio sesion (el JWT viene en la cookie). Veririco que el JWT sea valido
    if(req.cookies?.token) {

        try {
            const usuario = usuarioService.verifyJWT(req.cookies.token);
            return res.status(200).json(usuario);

        } catch (error) {
            // Si el JWT no es valido, lo elimino de la cookie y retorno un error
            res.clearCookie('token');
            return res.status(401).json('Token expirado o no valido');
        }
    }

    // Si no inicio sesion (el JWT no viene en la cookie)
    const { correo, contrasena } = req.body;

    if(!correo || !contrasena) return res.status(400).json('Datos incompletos');

    try {
        const usuario = await usuarioService.login(correo, contrasena);
        // Guardo el JWT en la cookie
        res.cookie('token', usuario.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
        return res.status(200).json(usuario);
        
    } catch (error) {
        // Error de correo sin formato o inexistente o contrasena incorrecta
        if(error instanceof InvalidValueError) return res.status(404).json(error.message);

    }

}

async function logout(req: Request, res: Response) {
    // Elimino el JWT de la cookie
    res.clearCookie('token');
    return res.status(204).send();
}

async function resetPassword(req: Request, res: Response) {

    const userId = req.body.idUsuario;

    if (!userId) return res.status(400).json('Datos incompletos');

    try {
        const user = await usuarioService.getUsuarioById(userId, false);
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
            text: `Haga click en el siguiente link para reestablecer su contraseña: ${process.env.FRONTEND_URL}/reset-password/${token}/${user.id}`
        }

        transporter.sendMail(mail, (error, body) => {
            if(error) return res.status(400).json({error: error.message});
            return res.status(204).send();
        });


    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
    }
    
}

export default { login, logout, resetPassword};