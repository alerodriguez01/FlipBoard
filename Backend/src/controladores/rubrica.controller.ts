import { Request, Response } from "express";
import service from "../servicios/rubrica.service.js";

/*
    Obtener rubrica por id
*/
async function getRubricaById (req: Request, res: Response) {

    const rubrica = await service.getRubricaById(req.params.idRubrica);

    res.status(200).json(rubrica);
}

export default { getRubricaById };