import { Request, Response } from "express";
import service from "../servicios/usuario.service.js";

/*
    Obtener usuario por id
*/
async function getUsuarioById(req: Request, res: Response) {

    const usuario = await service.getUsuarioById(req.params.idUsuario);

    res.status(200).json(usuario);
}

export default { getUsuarioById };