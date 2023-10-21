import { Request, Response } from "express";
import service from "../servicios/rubrica.service.js";
import { Rubrica } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";

/*
    Obtener rubrica por id
*/
async function getRubricaById (req: Request, res: Response) {

    try {
        const rubrica = await service.getRubricaById(req.params.idRubrica);
        res.status(200).json(rubrica);
        
    } catch (error) {
        if(error instanceof NotFoundError) return res.status(404).json(error.message);
    }
}

/*
    Crear rubrica
*/
async function createRubrica(req: Request, res: Response) {
    
    const body = req.body;

    if (!body.nombre || !body.criterios || body.criterios.length<1 || !body.niveles || body.niveles.length<1)
        return res.status(400).json("Rubrica invalida");
    if(!body.usuarioId)
        return res.status(400).json("Faltan datos para la creacion.");
    
    const rubrica = {
        nombre: body.nombre,
        criterios: body.criterios,
        niveles: body.niveles,
        usuarioId: body.usuarioId,
    };

    try{
        const newRubrica = await service.createRubrica(rubrica as Rubrica);
        return res.status(201).json(newRubrica);
    } catch(err){
        if(err instanceof InvalidValueError) return res.status(400).json(err.message);
        if(err instanceof NotFoundError) return res.status(404).json(err.message);
    }
}

export default { getRubricaById, createRubrica };