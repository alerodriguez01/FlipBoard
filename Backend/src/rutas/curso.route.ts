import { Router } from "express";
import controller from "../controladores/curso.controller.js";

const router = Router();

/*
    Cargar curso con murales (id y nombre, y mural tiene que traer la rúbrica 
    asignada -solo nombre de rúbrica asignada-)
*/
router.get("/:idCurso", controller.getCursoById);
/*
    Guardar curso
    body: {
        nombre: string,
        tema?: string,
        sitioWeb?: string,
        descripcion?: string,
        emailContacto: string,
        docentes?: string[], // idDocente (opcional, pero deberia estar)
    }
*/
router.post("/", controller.saveCurso);

export default router;