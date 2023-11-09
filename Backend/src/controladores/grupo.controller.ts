import { Request, Response } from "express";
import service from "../servicios/grupo.service.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { Grupo } from "@prisma/client";

/*
    Obtener grupos de un curso idCurso
    Parametros opcionales: nombre, limit, offset
*/
async function getGruposFromCurso(req: Request, res: Response) {
    
    const idCurso = req.params.idCurso;
    const nombre = req.query.nombre ? req.query.nombre as string : "";

    //            si existe         
    let limit = req.query.limit ? 
                                  parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
                                  : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if(limit < 0) limit = 0;
    if(offset < 0) offset = 0;

    try {
        const grupos = await service.getGruposFromCurso(idCurso, nombre, limit, offset);
        res.status(200).json(grupos);

    } catch (error) {
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

/*
    Crear grupo
*/
async function createGrupo(req: Request, res: Response) {
    
    const idCurso = req.params.idCurso;
    const integrantes = req.body.integrantes;

    if(!integrantes)
        return res.status(400).json("Grupo invalido");

    const grupo = {
        integrantes: integrantes,
        cursoId: idCurso
    }

    try {
        const newGrupo = await service.createGrupo(grupo as Grupo);
        return res.status(201).json(newGrupo);
    } catch (err){
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message });
    }
}

export default { getGruposFromCurso, createGrupo}