import { Request, Response } from "express";
import service from "../servicios/grupo.service.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";

/*
    Obtener grupos de un curso idCurso
    Parametros opcionales: integrante, limit, offset
*/
async function getGruposFromCurso(req: Request, res: Response) {
    
    const idCurso = req.params.idCurso;
    const integrante = req.query.integrante ? req.query.integrante as string : "";

    //            si existe         
    let limit = req.query.limit ? 
                                  parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
                                  : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if(limit < 0) limit = 0;
    if(offset < 0) offset = 0;

    try {
        const grupos = await service.getGruposFromCurso(idCurso, integrante, limit, offset);
        res.status(200).json(grupos);

    } catch (error) {
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

export default { getGruposFromCurso }