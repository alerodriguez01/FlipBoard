import { Mural } from "@prisma/client";
import service from "../servicios/mural.service.js";
import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";

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
    }

}

async function getMuralesFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const traerRubrica = req.query.rubrica === "true";

    try {
        const murales = await service.getMuralesFromCurso(idCurso, traerRubrica);
        return res.status(200).json(murales);
    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
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

    }

}

/*
    Crear un mural
*/
async function createMural(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const { nombre, contenido, descripcion, idRubrica, idDocente } = req.body;

    if (!nombre || !contenido || !idDocente) return res.status(400).json({ error: "Faltan datos obligatorios" });

    const mural = {
        nombre,
        contenido,
        descripcion: descripcion ?? null,
        cursoId: idCurso,
        rubricaId: idRubrica ?? null
    }

    try {
        const newMural = await service.createMural(mural as Mural, idDocente)
        return res.status(201).json(newMural);

    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message }); // idCurso o idMural invalido
        if (err instanceof NotFoundError) return res.status(404).json({ error: err.message }); // no se encontro el mural o la rubrica

    }

}

async function deleteMuralById(req: Request, res: Response) {

    const idMural = req.params.idMural;
    const docente = req.query.docente;

    if (!docente) return res.status(400).json({ error: "Faltan datos obligatorios" });

    try {
        await service.deleteMuralById(idMural, docente as string);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message }); // el docente no es docente del curso
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
    }
}

export default { getMuralById, getMuralesFromCurso, asociateRubricaToMural, createMural, deleteMuralById };