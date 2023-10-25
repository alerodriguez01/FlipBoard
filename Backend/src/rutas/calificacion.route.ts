import { Router } from "express";
import calificacionController from "../controladores/calificacion.controller.js";

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
 *        valores: [3, 1]
 *        observaciones: Buen trabajo
 *        rubricaId: 65326ed824fea7e06d01e20d
 *        usuarioId: 65326ed824fea7e06d01e207
 *        cursoId: 65326ed824fea7e06d01e20b
 *        muralId: 65326ed824fea7e06d01e21
 */


/**
 * @swagger
 * /api/cursos/{idCurso}/calificaciones/alumnos/{idAlumno}:
 *   get:
 *     summary: Obtener las calificaciones de un alumno
 *     tags: [Calificacion]
 *     parameters:
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20b
 *       - name: idAlumno
 *         in: path
 *         required: true
 *         description: El id del usuario
 *         schema:
 *           type: string
 *         example:
 *           65436ed824fea7e06d04ghd
 *       - name: rubrica
 *         in: query
 *         required: false
 *         description: Indica si se debe incluir la rubrica en cada calificacion
 *         schema:
 *           type: boolean
 *         example:
 *           true
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Limite de calificaciones a obtener
 *         schema:
 *           type: number
 *         example:
 *           5
 *       - name: offset
 *         in: query
 *         required: false
 *         description: Numero de calificaciones a saltar
 *         schema:
 *           type: number
 *         example:
 *           5
 *     responses:
 *       200:
 *         description: Calificaciones del alumno encontradas (incluye rubrica)
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Calificacion'
 *       404:
 *         description: Valor invalido para idCurso o idUsuario
 *         content:
 *           application/json:
 *             example:
 *               message: Valor invalido para el atributo idCurso o idUsuario de Calificacion
 */
router.get("/:idCurso/calificaciones/alumnos/:idUsuario", calificacionController.getCalificacionesFromUser)

// TODO - ID14 - Crear calificacion
router.post("/calificaciones/alumnos/:idUsuario")

// TODO - ID14 - Crear calificacion
router.get("/:idCurso/calificaciones/grupos/:idGrupo")

// TODO - ID20 - Traer todas las calificaciones del curso (cursoId) que tengan asociada una rúbrica (rúbricaId). Tiene que ser paginado (aunque quizá no sea necesario, porque solo hay que traer la calificación). 
router.get("/:idCurso/calificaciones")

export default router;