import { Mural } from "@prisma/client";
import service from "../servicios/mural.service.js";
import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";

/*
    Traer mural (opcionalmente junto a su rubrica asociada)
*/
async function getMuralById(req: Request, res: Response) {

    const idMural = req.params.idMural;

    const traerRubrica = req.query.rubrica === "true";

    try {
        const mural = await service.getMuralById(idMural, traerRubrica);
        return res.status(200).json(mural);
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function getMuralesFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const traerRubrica = req.query.rubrica === "true";
    const nombre = req.query.nombre as string ?? null;

    try {
        const murales = await service.getMuralesFromCurso(idCurso, traerRubrica, nombre);
        return res.status(200).json(murales);
    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

/*
    Asociar una rubrica al mural
*/
async function asociateRubricaToMural(req: Request, res: Response) {

    const idMural = req.params.idMural;
    const idRubrica = req.body.idRubrica;

    if (!idRubrica) return res.status(400).json({ error: "Falta el atributo idRubrica" });

    try {
        await service.asociateRubricaToMural(idMural, idRubrica);
        return res.status(204).send();

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso o idMural invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el mural o la rubrica
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Crear un mural
*/
async function createMural(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const { nombre, contenido, descripcion, idRubrica } = req.body;

    if (!nombre || !contenido) return res.status(400).json({ error: "Faltan datos obligatorios" });

    const mural = {
        nombre,
        contenido,
        descripcion: descripcion ?? null,
        cursoId: idCurso,
        rubricaId: idRubrica ?? null
    }

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    try {
        const newMural = await service.createMural(token, mural as Mural)
        return res.status(201).json(newMural);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso o idMural invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el mural o la rubrica
        if (err instanceof NotAuthorizedError) return res.status(401).json({ error: err.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function updateMural(req: Request, res: Response) {

    const idMural = req.params.idMural;
    const { nombre, descripcion, idRubrica, idCurso } = req.body;

    if (!nombre || !idCurso) return res.status(400).json({ error: "Faltan datos obligatorios" });

    const mural = {
        nombre,
        descripcion,
        rubricaId: idRubrica
    }

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    try {
        const newMural = await service.updateMural(token, idMural, mural as Mural, idCurso)
        return res.status(200).json(newMural);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso o idMural invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el mural o la rubrica
        if (err instanceof NotAuthorizedError) return res.status(401).json({ error: err.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function deleteMuralById(req: Request, res: Response) {

    const idMural = req.params.idMural;

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    try {
        await service.deleteMuralById(token, idMural);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message }); // el docente no es docente del curso
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof NotAuthorizedError) return res.status(401).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

export default { getMuralById, getMuralesFromCurso, asociateRubricaToMural, createMural, deleteMuralById, updateMural };