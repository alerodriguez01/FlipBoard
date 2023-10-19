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

    const curso = req.body;

    const cursoSaved = await service.saveCurso(curso);

    return res.status(201).json(cursoSaved);

}

// demas metodos 


export default { getCursoById, saveCurso };