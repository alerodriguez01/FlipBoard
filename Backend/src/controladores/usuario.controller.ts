import { Request, Response } from "express";
import service from "../servicios/usuario.service.js";
import { Usuario } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";

/*
    Obtener usuario por id (opcionalmente con sus cursos)
*/
async function getUsuarioById(req: Request, res: Response) {

    try {
        const usuario = await service.getUsuarioById(req.params.idUsuario, req.query.cursos === 'true');
        res.status(200).json(usuario);

    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(404).json({ error: error.message });
    }
}

/*
    Crear un usuario
*/
async function createUsuario(req: Request, res: Response) {

    const usuarioBody = req.body;

    if (!usuarioBody.nombre || !usuarioBody.correo || !usuarioBody.contrasena)
        return res.status(400).json("Faltan datos obligatorios")

    const user = {
        nombre: usuarioBody.nombre,
        correo: usuarioBody.correo,
        contrasena: usuarioBody.contrasena
    }

    try {
        const newUser = await service.createUsuario(user as Usuario);
        return res.status(201).json(newUser);
    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json(err.message);
    }
}

/*
    Buscar participantes de un curso
*/
async function getParticipantes(req: Request, res: Response) {

    // offset is number && limit not number -> default limit
    // offset is number && limit is number-> ok
    // offset not number && limit is number -> offset=0
    let limit = req.query.limit ? parseInt(req.query.limit as string) || 0 : 0  // !isNaN(parseInt(req.params.limit)) ? parseInt(req.params.limit) : 0;
    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0 // !isNaN(parseInt(req.params.offset)) ? parseInt(req.params.offset) : 0;

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    const nombre = req.query.nombre ? req.query.nombre.toString() : '';


    try {
        const users = await service.getParticipantes(req.params.idCurso, nombre, limit, offset);
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof InvalidValueError) res.status(404).json({ error: error.message });
    }

}

async function addParticipante(req: Request, res: Response) {

    const userBody = req.body;

    if (!userBody.id) return res.status(400).json("Faltan datos obligatorios");

    try {
        await service.addParticipanteToCurso(req.params.idCurso, userBody.id);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json(error.message);
    }

}

export default { getUsuarioById, createUsuario, getParticipantes, addParticipante };