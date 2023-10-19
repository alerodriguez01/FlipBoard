import { Mural } from "@prisma/client";
import service from "../servicios/mural.service.js";
import { Request, Response } from "express";

/*
    Traer mural (opcionalmente junto a su rubrica asociada)
*/
async function getMuralById(req: Request, res: Response) {

    const idMural = req.params.idMural;
    
    const traerRubrica = req.query.rubrica === "true";

    const mural = await service.getMuralById(idMural, traerRubrica);

    return res.status(200).json(mural);

}

export default { getMuralById };