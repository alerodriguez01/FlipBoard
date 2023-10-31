import { Request, Response } from "express";
import usuarioService from "../servicios/usuario.service.js";
import { InvalidValueError } from "../excepciones/RepoErrors.js";

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

export default { login, logout };