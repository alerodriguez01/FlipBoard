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
 *               example:
 *                count: 1
 *                result:
 *                 - id: "65397634490a7145b8387810"
 *                   valores:
 *                     - 3
 *                     - 4
 *                   observaciones: "Buen trabajo"
 *                   rubricaId: "65397634490a7145b838780a"
 *                   grupoId: null
 *                   usuarioId: "65397634490a7145b8387804"
 *                   cursoId: "65397634490a7145b8387808"
 *                   muralId: "65397634490a7145b838780e"
 *       400:
 *         description: El parametro idCurso es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idCurso de Calificacion
 *       404:
 *         description: La rubrica no fue encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Calificacion' en la BDD
 */
router.get("/:idCurso/calificaciones/alumnos/:idUsuario", calificacionController.getCalificacionesFromUser)

/**
 * @swagger
 * /api/cursos/{idCurso}/calificaciones/alumnos/{idAlumno}:
 *   post:
 *    summary: Crear una nueva calificacion para un alumno / crear o actualizar una calificacion parcial para un alumno
 *    tags: [Calificacion]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso asociado
 *        schema:
 *          type: string
 *        example:
 *          65397634490a7145b8387808
 *      - name: idAlumno
 *        in: path
 *        required: true
 *        description: El id del alumno a calificar
 *        schema:
 *          type: string
 *        example:
 *          65397634490a7145b8387804
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - valores
 *              - idRubrica
 *              - idDocente
 *            properties:
 *              valores:
 *                type: list
 *                description: Los valores de la calificacion
 *              observaciones:
 *                type: string
 *                description: Las observaciones de la calificacion
 *              idRubrica:
 *                type: string
 *                description: La rubrica asociada a la calificacion
 *              idMural:
 *                type: string
 *                description: El mural asociado a la calificacion
 *              idDocente:
 *                type: string
 *                description: El docente que califica
 *              isParcial:
 *                type: boolean
 *                description: Indica si la calificacion es parcial
 *            example:
 *              isParcial: true
 *              valores: [3, 1]
 *              observaciones: Buen trabajo
 *              idRubrica: 65397634490a7145b838780a
 *              idMural: 65397634490a7145b838780e
 *              idDocente: 65397634490a7145b8387804
 *    responses:
 *      201: 
 *        description: Calificacion creada exitosamente
 *        content:
 *          application/json:
 *            example:
 *              id: 653a6a5b356a77c448313fea
 *              valores: [3, 1]
 *              observaciones: Buen trabajo
 *              rubricaId: 65397634490a7145b838780a
 *              usuarioId: 65326ed824fea7e06d01e207
 *              cursoId: 65397634490a7145b8387808
 *              muralId: 65397634490a7145b838780e
 *              isParcial: true
 *      400:
 *        description: Faltan datos obligatorios o alguno de los id's o datos es invalido
 *        content:
 *          application/json:
 *            example:
 *              message: Valor invalido para el atributo id de Curso, Rubrica, Usuario o Mural
 *      404:
 *        description: No se encontraron algunas de las entidades provistas por el id
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Curso, Rubrica, Usuario, Grupo o Mural' en la BDD
 */
router.post("/:idCurso/calificaciones/alumnos/:idUsuario", calificacionController.createCalificacion)

/**
 * @swagger
 * /api/cursos/{idCurso}/calificaciones/grupos/{idGrupo}:
 *   post:
 *    summary: Crear una nueva calificacion para un grupo  / crear o actualizar una calificacion parcial para un grupo
 *    tags: [Calificacion]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso asociado
 *        schema:
 *          type: string
 *        example:
 *          65397634490a7145b8387808
 *      - name: idGrupo
 *        in: path
 *        required: true
 *        description: El id del grupo a calificar
 *        schema:
 *          type: string
 *        example:
 *          65397634490a7145b838780c
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - valores
 *              - idRubrica
 *              - idDocente
 *            properties:
 *              valores:
 *                type: list
 *                description: Los valores de la calificacion
 *              observaciones:
 *                type: string
 *                description: Las observaciones de la calificacion
 *              idRubrica:
 *                type: string
 *                description: La rubrica asociada a la calificacion
 *              idMural:
 *                type: string
 *                description: El mural asociado a la calificacion
 *              idDocente:
 *                type: string
 *                description: El docente que califica
 *              isParcial:
 *                type: boolean
 *                description: Indica si la calificacion es parcial
 *            example:
 *              isParcial: true
 *              valores: [3, 1]
 *              observaciones: Buen trabajo
 *              idRubrica: 65397634490a7145b838780a
 *              idMural: 65397634490a7145b838780e
 *              idDocente: 65397634490a7145b8387804
 *    responses:
 *      201: 
 *        description: Calificacion creada exitosamente
 *        content:
 *          application/json:
 *            example:
 *              id: 653a6a5b356a77c448313fea
 *              valores: [3, 1]
 *              observaciones: Buen trabajo
 *              rubricaId: 65397634490a7145b838780a
 *              grupoId: 65397634490a7145b838780c
 *              cursoId: 65397634490a7145b8387808
 *              muralId: 65397634490a7145b838780e
 *              isParcial: true
 *      400:
 *        description: Faltan datos obligatorios o alguno de los id's o datos es invalido
 *        content:
 *          application/json:
 *            example:
 *              message: Valor invalido para el atributo id de Curso, Rubrica, Usuario, Grupo o Mural
 *      404:
 *        description: No se encontraron algunas de las entidades provistas por el id
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Curso, Rubrica, Usuario, Grupo o Mural' en la BDD
 */
router.post("/:idCurso/calificaciones/grupos/:idGrupo", calificacionController.createCalificacion)


/**
 * @swagger
 * /api/cursos/{idCurso}/calificaciones:
 *   get:
 *     summary: Obtener las calificaciones del curso
 *     tags: [Calificacion]
 *     parameters:
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b8387808
 *       - name: rubrica
 *         in: query
 *         required: false
 *         description: El id de la rubrica asociado a las calificaciones
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b838780a
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
 *       - name: idMural
 *         in: query
 *         required: false
 *         description: El id del mural asociado a las calificaciones
 *         schema:
 *           type: string
 *         example:
 *           65397634490b7145b838789c
 *       - name: nombre
 *         in: query
 *         required: false
 *         description: nombre del alumno o integrante del grupo por el que se quiere filtrar
 *         schema:
 *           type: string
 *         example:
 *           "Tomas P"
 *       - name: isParcial
 *         in: query
 *         required: false
 *         description: buscar una única calificacion parcial, segun los campos del body
 *         schema:
 *           type: boolean
 *         example:
 *           true
 *       - name: idDocente
 *         in: query
 *         required: false
 *         description: id del docente que califico parcialmente
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b8387804
 *       - name: idAlumno   
 *         in: query
 *         required: false
 *         description: id del alumno que se califica parcialmente
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b8387804
 *       - name: idGrupo
 *         in: query
 *         required: false
 *         description: id del grupo que se califica parcialmente
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b8387804
 *     responses:
 *       200:
 *         description: Calificaciones del curso encontradas
 *         content:
 *           application/json:
 *               example:
 *                count: 2
 *                result:
 *                 - id: "65397634490a7145b8387810"
 *                   valores:
 *                     - 3
 *                     - 4
 *                   observaciones: "Buen trabajo"
 *                   rubricaId: "65397634490a7145b838780a"
 *                   grupoId: null
 *                   usuarioId: "65397634490a7145b8387804"
 *                   cursoId: "65397634490a7145b8387808"
 *                   muralId: "65397634490a7145b838780e"
 *                 - id: "653a6a5b356a77c448313fea"
 *                   valores:
 *                     - 2
 *                     - 1
 *                   observaciones: "EXCELENTE!!!"
 *                   rubricaId: "65397634490a7145b838780a"
 *                   grupoId: null
 *                   usuarioId: "65397634490a7145b8387804"
 *                   cursoId: "65397634490a7145b8387808"
 *                   muralId: "65397634490a7145b838780e"
 *       400:
 *         description: El parametro idCurso (o idRubrica en query param) es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idCurso o idRubrica de Calificacion
 */
router.get("/:idCurso/calificaciones", calificacionController.getCalificacionesFromCurso)

/**
 * @swagger
 * /api/cursos/{idCurso}/calificaciones/grupos:
 *   get:
 *     summary: Obtener las calificaciones del curso asociadas a grupos
 *     tags: [Calificacion]
 *     parameters:
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b8387808
 *       - name: rubrica
 *         in: query
 *         required: false
 *         description: El id de la rubrica asociado a las calificaciones
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b838780a
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
 *       - name: nombre
 *         in: query
 *         required: false
 *         description: nombre del integrante del grupo por el que se quiere filtrar
 *         schema:
 *           type: string
 *         example:
 *           "Tomas P"
 *     responses:
 *       200:
 *         description: Calificaciones del curso encontradas
 *         content:
 *           application/json:
 *             example:
 *               count: 1
 *               result:
 *                 - id: "65625e29ac05c8d5efd80f12"
 *                   valores:
 *                     - 1
 *                     - 0
 *                   observaciones: "Buen trabajo"
 *                   fecha: "2023-11-25T20:50:49.920Z"
 *                   rubricaId: "65397634490a7145b838780a"
 *                   grupoId: "65624ea5fff8bfd446d354c3"
 *                   usuarioId: null
 *                   cursoId: "65397634490a7145b8387808"
 *                   muralId: null
 *                   grupoModel:
 *                     id: 65624ea5fff8bfd446d354c3
 *                     integrantes:
 *                       - 65624ea5fff8bfd446d354b5
 *                       - 65624ea5fff8bfd446d354b7
 *       400:
 *         description: El parametro idCurso (o idRubrica en query param) es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idCurso o idRubrica de Calificacion
 */
router.get("/:idCurso/calificaciones/grupos", calificacionController.getCalificacionesOfGruposFromCurso)

/**
 * @swagger
 * /api/cursos/{idCurso}/calificaciones/alumnos:
 *   get:
 *     summary: Obtener las calificaciones del curso asociadas a alumnos
 *     tags: [Calificacion]
 *     parameters:
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b8387808
 *       - name: rubrica
 *         in: query
 *         required: false
 *         description: El id de la rubrica asociado a las calificaciones
 *         schema:
 *           type: string
 *         example:
 *           65397634490a7145b838780a
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
 *       - name: nombre
 *         in: query
 *         required: false
 *         description: nombre del alumno por el que se quiere filtrar
 *         schema:
 *           type: string
 *         example:
 *           "Tomas P"
 *     responses:
 *       200:
 *         description: Calificaciones del curso encontradas
 *         content:
 *           application/json:
 *             example:
 *               count: 1
 *               result:
 *                 - id: "65625e29ac05c8d5efd80f12"
 *                   valores:
 *                     - 1
 *                     - 0
 *                   observaciones: "Buen trabajo"
 *                   fecha: "2023-11-25T20:50:49.920Z"
 *                   rubricaId: "65397634490a7145b838780a"
 *                   grupoId: null
 *                   usuarioId: "65397634490a7145b8387999"
 *                   cursoId: "65397634490a7145b8387808"
 *                   muralId: null
 *       400:
 *         description: El parametro idCurso (o idRubrica en query param) es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idCurso o idRubrica de Calificacion
 */
router.get("/:idCurso/calificaciones/alumnos", calificacionController.getCalificacionesOfAlumnosFromCurso)

export default router;