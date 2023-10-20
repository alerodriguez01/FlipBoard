import { Request, Response } from "express";
import usuarioService from "../servicios/usuario.service.js";
import { InvalidValueError } from "../excepciones/RepoErrors.js";

async function login(req: Request, res: Response) {
    
    const { correo, contrasena } = req.body;

    try {
        const usuario = await usuarioService.login(correo, contrasena);
        return res.status(200).json(usuario);
        
    } catch (error) {
        // Error de correo o contrasena incorrecto
        if(error instanceof InvalidValueError) return res.status(404).json(error.message);

    }

}

export default { login };