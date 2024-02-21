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
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
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
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

/*
    Cargar todas las rubricas de un usuario
*/
async function getAllRubricasByUserId(req: Request, res: Response) {

    const userId = req.params.idUsuario;
    const nombreRub = req.query.nombre ? req.query.nombre as string : "";

    try {
        const rubricas = await service.getAllRubricasByUserId(userId, nombreRub);
        return res.status(200).json(rubricas);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Obtener las rubricas asociadas a los alumnos de un curso
*/
async function getRubricasAlumnosFromCurso(req: Request, res: Response) {

    const cursoId = req.params.idCurso;
    const nombre = req.query.nombre;

    try {
        const rubricas = await service.getRubricasAlumnosFromCurso(cursoId, nombre?.toString());
        return res.status(200).json(rubricas);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el curso
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Obtener las rubricas asociadas a los grupos de un curso
*/
async function getRubricasGruposFromCurso(req: Request, res: Response) {

    const cursoId = req.params.idCurso;
    const nombre = req.query.nombre;

    try {
        const rubricas = await service.getRubricasGruposFromCurso(cursoId, nombre?.toString());
        return res.status(200).json(rubricas);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el curso
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Asociar una rubrica a todos los alumnos en un curso
*/
async function asociateRubricaAlumnosToCurso(req: Request, res: Response) {

    const cursoId = req.params.idCurso;
    const idRubrica = req.body.idRubrica;

    if (!idRubrica) return res.status(400).json({ error: "Falta el atributo idRubrica" });

    try {
        await service.asociateRubricaAlumnosToCurso(cursoId, idRubrica);
        return res.status(204).send();

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso o idRubrica invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el curso o la rubrica
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Asociar una rubrica a todos los grupos en un curso
*/
async function asociateRubricaGruposToCurso(req: Request, res: Response) {

    const cursoId = req.params.idCurso;
    const idRubrica = req.body.idRubrica;

    if (!idRubrica) return res.status(400).json({ error: "Falta el atributo idRubrica" });

    try {
        await service.asociateRubricaGruposToCurso(cursoId, idRubrica);
        return res.status(204).send();

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso o idRubrica invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el curso o la rubrica
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function deleteRubricaById(req: Request, res: Response) {

    const { idUsuario, idRubrica } = req.params;

    try {
        await service.deleteRubricaById(idRubrica, idUsuario);
        return res.status(204).send();

    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message }); // ids invalidos o la rubrica no le pertence al usuario
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

export default {
    getRubricaById, createRubrica, getAllRubricasByUserId,
    getRubricasAlumnosFromCurso, getRubricasGruposFromCurso, asociateRubricaAlumnosToCurso,
    asociateRubricaGruposToCurso, deleteRubricaById
};