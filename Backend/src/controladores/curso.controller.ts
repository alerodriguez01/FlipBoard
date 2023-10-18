import service from "../servicios/curso.service.js";
import { Request, Response } from "express";


async function getCursoById(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    
    if(req.query.murales === 'true'){

        const curso = await service.getCursoWithMuralesAndRubrica(idCurso);
        return res.status(200).json(curso);

    } 
    
    const curso = await service.getCursoById(idCurso);
    return res.status(200).json(curso);
}


/*
    Cargar curso con murales (id y nombre, y mural tiene que traer la rúbrica 
    asignada -solo nombre de rúbrica asignada-)
*/
async function getCursoWithMuralesAndRubrica(req: Request, res: Response) {
    
    const idCurso = req.params.idCurso;
    if(req.query.murales !== 'true') return res.status(400).send('No se especificó que se quieren los murales');

    const curso = await service.getCursoWithMuralesAndRubrica(idCurso);

    return res.status(200).json(curso);

}

// demas metodos


export default { getCursoById };