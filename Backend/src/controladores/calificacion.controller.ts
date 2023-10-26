import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import service from "../servicios/calificacion.service.js";
import { Calificacion } from "@prisma/client";

/*
    Obtener las calificaciones de un usuario
    Parametros: 
        - idCurso: El id del curso
        - idUsuario: El id del usuario
        - limit, offset y rubrica: query params
    La calificacion debe incluir la rubrica
*/
async function getCalificacionesFromUser(req: Request, res: Response) {

    const { idCurso, idUsuario } = req.params;

    //            si existe         
    let limit = req.query.limit ? 
                                parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
                                : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if(limit < 0) limit = 0;
    if(offset < 0) offset = 0;

    try {
        const calificaciones = await service.getCalificacionesFromUser(idCurso, idUsuario, req.query.rubrica === "true", limit, offset);
        return res.status(200).json(calificaciones);

    } catch (error) {
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }
    
}

/*
    Crear calificacion para un alumno o grupo
*/
async function createCalificacion(req: Request, res: Response) {

    const idUsuario = req.params.idUsuario;
    const idGrupo = req.params.idGrupo;
    const idCurso = req.params.idCurso;

    const { valores, observaciones, idRubrica, idMural, idDocente } = req.body;

    // Datos obligatorios
    if(!valores || !idRubrica) return res.status(400).json({ error: "Faltan datos obligatorios" });

    // valores debe ser un array de numeros
    if(!Array.isArray(valores) || valores.some((valor: any) => typeof valor !== 'number')) return res.status(400).json({ error: "Valores debe ser un array de numeros. Ejemplo: valores: [1, 3]" });
    
    let calificacion: any = {
        valores: valores,
        observaciones: observaciones,
        rubricaId: idRubrica,
        cursoId: idCurso,
        muralId: idMural ?? null
    }

    if(idUsuario) calificacion.usuarioId = idUsuario;
    if(idGrupo) calificacion.grupoId = idGrupo;

    try {
        const newCalificacion = await service.createCalificacion(calificacion as Calificacion, idDocente);
        return res.status(201).json(newCalificacion);

    } catch (error) {
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message }); // alguno de los id esta mal formado
        if(error instanceof NotFoundError) res.status(404).json({ error: error.message }); // no se encontro alguna de las entidades
    }

}

/*
    Obtener las calificaciones del curso
*/
async function getCalificacionesFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const idRubrica = req.query.rubrica;

    //            si existe         
    let limit = req.query.limit ? 
                                parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
                                : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if(limit < 0) limit = 0;
    if(offset < 0) offset = 0;

    try {
        const calificaciones = await service.getCalificacionesFromCurso(idCurso, limit, offset, idRubrica?.toString());
        return res.status(200).json(calificaciones);

    } catch (error) {
        if(error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

export default { getCalificacionesFromUser, createCalificacion, getCalificacionesFromCurso };