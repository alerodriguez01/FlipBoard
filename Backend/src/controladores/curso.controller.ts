import { Curso } from "@prisma/client";
import service from "../servicios/curso.service.js";
import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";


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
        if (error instanceof InvalidValueError) return res.status(404).json({ error: error.message });
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


export default { getCursoById, saveCurso, getCursos };