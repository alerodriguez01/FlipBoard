import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import service, { CalificacionCSV } from "../servicios/calificacion.service.js";
import { Calificacion } from "@prisma/client";
import csv from "csv-writer";
import { randomUUID } from "crypto";
import fs from "fs";

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

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    try {
        const calificaciones = await service.getCalificacionesFromUser(idCurso, idUsuario, req.query.rubrica === "true", limit, offset);
        return res.status(200).json(calificaciones);

    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

/*
    Crear calificacion para un alumno o grupo / crear o actualizar una calificacion parcial
*/
async function createCalificacion(req: Request, res: Response) {

    const idUsuario = req.params.idUsuario;
    const idGrupo = req.params.idGrupo;
    const idCurso = req.params.idCurso;

    const { valores, observaciones, idRubrica, idMural, idDocente, isParcial } = req.body;

    // Datos obligatorios
    if (!valores || !idRubrica || !idDocente) return res.status(400).json({ error: "Faltan datos obligatorios" });

    // valores debe ser un array de numeros
    if (!Array.isArray(valores) || valores.some((valor: any) => typeof valor !== 'number')) return res.status(400).json({ error: "Valores debe ser un array de numeros. Ejemplo: valores: [1, 3]" });

    let calificacion: any = {
        valores: valores,
        observaciones: observaciones ?? null,
        rubricaId: idRubrica,
        cursoId: idCurso,
        muralId: idMural ?? null,
        docenteId: idDocente,
        isParcial: isParcial ?? false
    }

    if (idUsuario) calificacion.usuarioId = idUsuario;
    if (idGrupo) calificacion.grupoId = idGrupo;

    try {
        const newCalificacion = await service.createCalificacion(calificacion as Calificacion);
        return res.status(201).json(newCalificacion);

    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message }); // alguno de los id esta mal formado
        if (error instanceof NotFoundError) res.status(404).json({ error: error.message }); // no se encontro alguna de las entidades
    }

}

/*
    Obtener las calificaciones del curso
*/
async function getCalificacionesFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const idRubrica = req.query.rubrica;
    const idMural = req.query.idMural;
    const nombreUser = req.query.nombre;

    const isParcial = req.query.isParcial === "true"; // opcional
    const idDocente = req.query.idDocente;
    const idGrupo = req.query.idGrupo; // opcional
    const idAlumno = req.query.idAlumno; // opcional

    if (isParcial && idDocente && idRubrica) {

        try {
            const calificacion = await service.getCalificacionParcial(idRubrica.toString(), idMural?.toString() ?? null, idDocente.toString(), idGrupo?.toString() ?? null, idAlumno?.toString() ?? null)
            if(!calificacion) return res.status(404).json({ error: "No hay calificacion parcial" });
            return res.status(200).json(calificacion);

        } catch (error) {
            if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        }

    }

    //            si existe         
    let limit = req.query.limit ?
        parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
        : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    try {
        const calificaciones = await service.getCalificacionesFromCurso(idCurso, limit, offset, {
            idRubrica: idRubrica?.toString(), idMural: idMural?.toString(), nombreUser: nombreUser?.toString()
        });
        return res.status(200).json(calificaciones);

    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
    }

}

/*
    Obtener las calificaciones del curso asociadas a grupos
*/
async function getCalificacionesOfGruposFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const idRubrica = req.query.rubrica;
    const nombreInt = req.query.nombre;


    //            si existe         
    let limit = req.query.limit ?
        parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
        : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    try {
        const calificaciones = await service.getCalificacionesFromCurso(idCurso, limit, offset, {
            idRubrica: idRubrica?.toString(), grupo: true, nombreUser: nombreInt?.toString()
        });
        return res.status(200).json(calificaciones);

    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

/*
    Obtener las calificaciones del curso asociadas a alumnos
*/
async function getCalificacionesOfAlumnosFromCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const idRubrica = req.query.rubrica;
    const nombreAlumno = req.query.nombre;

    //            si existe         
    let limit = req.query.limit ?
        parseInt(req.query.limit as string) || 0 // lo parseo a int (si no es un numero, retorna NaN => falsy => me quedo con 0)
        : 0; // si no existe, lo seteo en 0

    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0;

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    try {
        const calificaciones = await service.getCalificacionesFromCurso(idCurso, limit, offset, {
            idRubrica: idRubrica?.toString(), alumno: true, nombreUser: nombreAlumno?.toString()
        });
        return res.status(200).json(calificaciones);

    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
    }

}

async function getCSVofCalificacionesFromCurso(req: Request, res: Response) {

        const idCurso = req.params.idCurso;

        // get data from service sorted by date
        let calificaciones: CalificacionCSV[] = [];
        try {
            calificaciones = await service.getCSVofCalificacionesFromCurso(idCurso);
        } catch (error) {
            if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
        }

        // define csv writer
        const path = `temp_csv/calificaciones_${randomUUID()}.csv`
        
        // find the max number of criterios
        let cantCriterios = 0; 
        calificaciones.forEach(cal => {
            if (Object.keys(cal).length - 8 > cantCriterios) cantCriterios = Object.keys(cal).length - 8;
        })
        let criterios: any = []
        for (let i = 0; i < cantCriterios; i++) {
            criterios.push({id: `criterio${i+1}`, title: `Criterio ${i+1} (nivel evaluado)`})
        }
        
        const csvWriter = csv.createObjectCsvWriter({
            path: path,
            header: [
                {id: 'fecha', title: 'Fecha'},
                {id: "alumno", title: "Alumno"},
                {id: "grupo", title: "Grupo"},
                {id: "tipo_evaluacion", title: "Tipo de evaluacion"},
                {id: "mural", title: "Mural"},
                {id: "rubrica", title: "Rubrica"},
                {id: "puntaje", title: "Puntaje"},
                {id: "observaciones", title: "Observaciones"},
                ...criterios
            ]
        });

        // write data to csv
        await csvWriter.writeRecords(calificaciones);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=calificaciones.csv');
        return res.status(200).sendFile(process.cwd() + "/" + path);

}

export default { getCalificacionesFromUser, createCalificacion, getCalificacionesFromCurso, 
    getCalificacionesOfGruposFromCurso, getCalificacionesOfAlumnosFromCurso, getCSVofCalificacionesFromCurso };