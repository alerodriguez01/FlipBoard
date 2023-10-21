import { Request, Response } from "express";
import service from "../servicios/usuario.service.js";
import { Usuario } from "@prisma/client";
import { InvalidValueError } from "../excepciones/RepoErrors.js";

/*
    Obtener usuario por id (opcionalmente con sus cursos)
*/
async function getUsuarioById(req: Request, res: Response) {

    try {
        const usuario = await service.getUsuarioById(req.params.idUsuario, req.query.cursos === 'true');
        res.status(200).json(usuario);
        
    } catch (error) {
        if(error instanceof InvalidValueError) return res.status(404).json(error.message);
    }
}

/*
    Crear un usuario
*/
async function createUsuario(req: Request, res: Response) {
    
    const usuarioBody = req.body;

    if(!usuarioBody.nombre || !usuarioBody.apellido || !usuarioBody.correo || !usuarioBody.contrasena)
        return res.status(400).json("Faltan datos obligatorios")
    
    const user = {
        nombre: usuarioBody.nombre,
        apellido: usuarioBody.apellido,
        correo: usuarioBody.correo,
        contrasena: usuarioBody.contrasena
    }

    try{
        const newUser = await service.createUsuario(user as Usuario);
        return res.status(201).json(newUser);
    } catch(err){
        if(err instanceof InvalidValueError) return res.status(400).json(err.message);
    }
}

export default { getUsuarioById, createUsuario };