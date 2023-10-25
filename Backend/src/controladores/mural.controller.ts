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
        if(error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

async function getMuralesFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const traerRubrica = req.query.rubrica === "true";
    
    try {
        const murales = await service.getMuralesFromCurso(idCurso, traerRubrica);
        return res.status(200).json(murales);
    } catch (error) {
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }
}

export default { getMuralById, getMuralesFromCurso };