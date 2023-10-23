import { Router } from "express";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Calificacion:
 *      type: object
 *      required:
 *        - valores
 *        - observaciones
 *        - rubricaId
 *        - cursoId
 *      properties:
 *        id:
 *          type: string
 *          description: El id de la calificacion
 *        valores:
 *          type: list
 *          description: Los valores de la calificacion
 *        observaciones:
 *          type: string
 *          description: Las observaciones de la calificacion
 *        rubricaId:
 *          type: string
 *          description: La rubrica asociada a la calificacion
 *        grupoId:
 *          type: string
 *          description: El grupo asociado a la calificacion
 *        usuarioId:
 *          type: list
 *          description: El usuario asociado a la calificacion
 *        cursoId:
 *          type: string
 *          description: El curso asociado a la calificacion
 *        muralId:
 *          type: string
 *          description: El mural asociado a la calificacion
 *      example:
 *        id: 65326ed824fea7e06d01e213
 *        valores: [3, 4]
 *        observaciones: Buen trabajo
 *        rubricaId: 65326ed824fea7e06d01e20d
 *        usuarioId: 65326ed824fea7e06d01e207
 *        cursoId: 65326ed824fea7e06d01e20b
 *        muralId: 65326ed824fea7e06d01e21
 */


// TODO - ID11 - Cargar calificaciones del curso (cursoId) que pertenecen al usuario (usuarioId), junto a la rúbrica (completa, todos los campos). Tiene que ser paginado.
router.get("/:idCurso/calificaciones/alumnos/:idUsuario")

// TODO - ID14 - Crear calificacion
router.post("/calificaciones/alumnos/:idUsuario")

// TODO - ID14 - Crear calificacion
router.get("/:idCurso/calificaciones/grupos/:idGrupo")

// TODO - ID20 - Traer todas las calificaciones del curso (cursoId) que tengan asociada una rúbrica (rúbricaId). Tiene que ser paginado (aunque quizá no sea necesario, porque solo hay que traer la calificación). 
router.get("/:idCurso/calificaciones")

export default router;