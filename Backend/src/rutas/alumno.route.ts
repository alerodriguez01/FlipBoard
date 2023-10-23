import { Router } from "express";

const router = Router();

// TODO - ID6 - Cargar curso con participantes (alumnos), y cada uno tiene que tener: id, nombre, apellido y correo. Tiene que ser paginado. 
// TODO - ID7 
// (van en la misma ruta)
router.get("/:idCurso/alumnos")

// TODO - ID26 - Añadir participante a un curso
router.put("/:idCurso/alumnos")

export default router;
