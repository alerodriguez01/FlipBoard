import { Curso } from "@prisma/client";
import service from "../servicios/curso.service.js";
import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";

/*
    Obtener curso por id
*/
async function getCursoById(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    try {
        const curso = await service.getCursoById(idCurso);
        return res.status(200).json(curso);

    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
    }
}

/*
    Guardar curso
*/
async function saveCurso(req: Request, res: Response) {

    const cursoBody = req.body;

    // Verifico que las claves obligatiorias esten
    if (!cursoBody.nombre || !cursoBody.emailContacto || !cursoBody.docentes || cursoBody.docentes.length == 0) return res.status(400).json("Faltan datos obligatorios");

    const curso = {
        nombre: cursoBody.nombre,
        tema: cursoBody.tema, // si no existe tema, guarda undefined
        sitioWeb: cursoBody.sitioWeb, // si no existe sitio web, guarda undefined
        descripcion: cursoBody.descripcion, // si no existe descripcion, guarda undefined
        emailContacto: cursoBody.emailContacto,
        docentes: cursoBody.docentes // si no existe docentes, guarda undefined
    }

    try {
        const cursoSaved = await service.createCurso(curso as Curso);
        return res.status(201).json(cursoSaved);
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json(error.message); // No existe el docente
        if (error instanceof InvalidValueError) return res.status(400).json(error.message); // email invalido
    }


}

/*
    Obtener todos los cursos
*/
async function getCursos(req: Request, res: Response) {
    const cursos = await service.getCursos();
    return res.status(200).json(cursos);
}

// demas metodos 

async function deleteCursoById(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const docente = req.query.docente;

    if (!docente) return res.status(400).json({ error: "Faltan datos obligatorios" });

    try {
        await service.deleteCursoById(idCurso, docente as string);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json(error.message); // el docente no es docente del curso
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
    }
}

async function updateCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const cursoBody = req.body;

    // Verifico que las claves obligatiorias esten
    if (!cursoBody.nombre || !cursoBody.emailContacto || !cursoBody.docentes || cursoBody.docentes.length == 0) return res.status(400).json("Faltan datos obligatorios");

    const curso = {
        nombre: cursoBody.nombre,
        tema: cursoBody.tema, // si no existe tema, guarda undefined
        sitioWeb: cursoBody.sitioWeb, // si no existe sitio web, guarda undefined
        descripcion: cursoBody.descripcion, // si no existe descripcion, guarda undefined
        emailContacto: cursoBody.emailContacto,
        docentes: cursoBody.docentes // si no existe docentes, guarda undefined
    }

    try {
        const cursoUpdated = await service.updateCurso(idCurso, curso as Curso);
        return res.status(200).json(cursoUpdated);
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json(error.message); // No existe el docente
        if (error instanceof InvalidValueError) return res.status(400).json(error.message); // email invalido
    }

}

// Agregar docente a un curso
async function addOrDeleteDocenteToCurso(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const idDocente = req.params.idDocente;

    const { agregar } = req.body;
    if (agregar === undefined) return res.status(400).json({ error: "Faltan datos obligatorios" });
    
    // verificar si es boolean
    if (typeof agregar !== 'boolean') return res.status(400).json({ error: "Tipos de datos incorrectos" });

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    try {
        const curso = await service.addOrDeleteDocenteToCurso(token, idCurso, idDocente, agregar);
        return res.status(201).json(curso);
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        if (error instanceof NotAuthorizedError) return res.status(401).json({ error: error.message });
    }

}

export default { getCursoById, saveCurso, getCursos, deleteCursoById, updateCurso, addOrDeleteDocenteToCurso };