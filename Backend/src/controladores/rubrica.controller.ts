import { Request, Response } from "express";
import service from "../servicios/rubrica.service.js";
import { Rubrica } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";

/*
    Obtener rubrica por id
*/
async function getRubricaById(req: Request, res: Response) {

    try {
        const rubrica = await service.getRubricaById(req.params.idRubrica);
        res.status(200).json(rubrica);

    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
    }
}

/*
    Crear rubrica
*/
async function createRubrica(req: Request, res: Response) {

    const body = req.body;

    if (!body.nombre || !body.criterios || body.criterios.length < 1 || !body.niveles || body.niveles.length < 1)
        return res.status(400).json({ error: "Rubrica invalida" });

    const rubrica = {
        nombre: body.nombre,
        criterios: body.criterios,
        niveles: body.niveles,
        usuarioId: req.params.idUsuario,
    };

    try {
        const newRubrica = await service.createRubrica(rubrica as Rubrica);
        return res.status(201).json(newRubrica);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idUsuario invalido o rubrica invalida
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el usuario
    }
}

/*
    Cargar todas las rubricas de un usuario
*/
async function getAllRubricasByUserId(req: Request, res: Response) {

    const userId = req.params.idUsuario;

    try {
        const rubricas = await service.getAllRubricasByUserId(userId);
        return res.status(200).json(rubricas);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message });
    }

}

/*
    Obtener las rubricas asociadas a los alumnos de un curso
*/
async function getRubricasAlumnosFromCurso(req: Request, res: Response){

    const cursoId = req.params.idCurso;

    try {
        const rubricas = await service.getRubricasAlumnosFromCurso(cursoId);
        return res.status(200).json(rubricas);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el curso

    }

}

/*
    Obtener las rubricas asociadas a los grupos de un curso
*/
async function getRubricasGruposFromCurso(req: Request, res: Response){

    const cursoId = req.params.idCurso;

    try {
        const rubricas = await service.getRubricasGruposFromCurso(cursoId);
        return res.status(200).json(rubricas);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el curso

    }

}

export default { getRubricaById, createRubrica, getAllRubricasByUserId, getRubricasAlumnosFromCurso, getRubricasGruposFromCurso };