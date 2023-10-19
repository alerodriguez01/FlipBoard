import { Curso } from "@prisma/client";
import service from "../servicios/curso.service.js";
import { Request, Response } from "express";


/*
    Obtener curso por id
*/
async function getCursoById(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    
    /*
        Cargar curso con murales con/sin rúbrica asignada
    */
    if(req.query.murales === 'true' && req.query.rubrica === 'true'){

        const curso = await service.getCursoWithMurales(idCurso, true);
        return res.status(200).json(curso);

    } else if(req.query.murales === 'true'){
        const curso = await service.getCursoWithMurales(idCurso, false);
        return res.status(200).json(curso);
    }
    
    const curso = await service.getCursoById(idCurso);
    return res.status(200).json(curso);
}

/*
    Guardar curso
*/
async function saveCurso(req: Request, res: Response) {

    const cursoBody = req.body;

    // Verifico que las claves obligatiorias esten
    if(!cursoBody.nombre || !cursoBody.emailContacto) return res.status(400).json("Faltan datos obligatorios");
    
    const curso = {
        nombre: cursoBody.nombre,
        tema: cursoBody.tema, // si no existe tema, guarda undefined
        sitioWeb: cursoBody.sitioWeb, // si no existe sitio web, guarda undefined
        descripcion: cursoBody.descripcion, // si no existe descripcion, guarda undefined
        emailContacto: cursoBody.emailContacto,
        docentes: cursoBody.docentes // si no existe docentes, guarda undefined
    }
    
    const cursoSaved = await service.saveCurso(curso as Curso);

    return res.status(201).json(cursoSaved);

}

// demas metodos 


export default { getCursoById, saveCurso };