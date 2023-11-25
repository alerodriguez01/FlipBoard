import { Router } from "express";
import controller from "../controladores/usuario.controller.js"

const router = Router();

/**
 * @swagger
 * /api/cursos/{idCurso}/alumnos:
 *   get:
 *    summary: Obtener participantes de un curso
 *    tags: [Usuario]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          65326ed824fea7e06d01e211
 *      - name: nombre
 *        in: query
 *        required: false
 *        description: Nombre y/o apellido del alumno a buscar
 *        schema:
 *          type: string
 *        example:
 *          Juan
 *      - name: limit
 *        in: query
 *        required: false
 *        description: Limite de alumnos a obtener
 *        schema:
 *          type: number
 *        example:
 *          5
 *      - name: offset
 *        in: query
 *        required: false
 *        description: Numero de alumnos a saltar
 *        schema:
 *          type: number
 *        example:
 *          5
 *    responses:
 *      200:
 *        description: Participantes encontrados
 *        content:
 *          application/json:
 *            example:
 *              count: 2
 *              result:
  *              - id: "653460ae39e91bc002bf42f1"
  *                nombre: "Juan"
  *                correo: "juan@example.com"
  *                contrasena: "$2a$10$RSPl7lG2beDJMvGZSpOcC./0oe4aFSILusGYZUFIKjNwhRFGSQEq6"
  *                cursosAlumno:
  *                  - "653460ae39e91bc002bf42f5"
  *                  - "653460ae39e91bc002bf42f6"
  *                cursosDocente:
  *                  - "653460ae39e91bc002bf42f5"
  *                  - "65368e734dcb343388ce78a1"
  *                grupos:
  *                  - "653460ae39e91bc002bf42f9"
  *                  - "653460ae39e91bc002bf42fa"
  *              
  *              - id: "653460ae39e91bc002bf42f2"
  *                nombre: "Maria"
  *                correo: "maria@example.com"
  *                contrasena: "$2a$10$tzUI6s7ajVJIM2ukmwhed.CZACun7iDJcGAwu3g4jLZaYBK/vSdtS"
  *                cursosAlumno:
  *                  - "653460ae39e91bc002bf42f6"
  *                cursosDocente: []
  *                grupos:
  *                  - "653460ae39e91bc002bf42f9"
 *      400:
 *        description: Valor invalido para idCurso
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idCurso de Usuario 
 */
router.get("/:idCurso/alumnos", controller.getParticipantes);

/**
 * @swagger
 * /api/cursos/{idCurso}/alumnos:
 *   put:
 *    summary: Agregar participante a un curso
 *    tags: [Usuario]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          65326ed824fea7e06d01e211
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            id: 653460ae39e91bc002bf42f1
 *    responses:
 *      204:
 *        description: Participante agregado al curso
 *      404:
 *        description: No se encontro el curso o el usuario
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Curso o Usuario' en la BDD
 *      400:
 *        description: Id de usuario ausente
 *        content:
 *          application/json:
 *            example:
 *              message: Faltan datos obligatorios
 */
router.put("/:idCurso/alumnos", controller.addParticipante);

/**
 * @swagger
 * /api/cursos/{idCurso}/alumnos/{idAlumno}:
 *   delete:
 *     summary: Eliminar un alumno del curso
 *     tags: [Usuario]
 *     parameters:
 *       - name: idAlumno
 *         in: path
 *         required: true
 *         description: El id del alumno
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20b
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20b
 *       - name: docente
 *         in: query
 *         required: true
 *         description: El id del docente
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20b
 *     responses:
 *       204:
 *         description: Alumno eliminado exitosamente
 *       400:
 *         description: El usuario no esta autorizado para eliminar el Alumno
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Docente' en 'Alumno'
 *       404:
 *         description: El Alumno no fue encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Alumno' en la BDD
 */
router.delete("/:idCurso/alumnos/:idAlumno", controller.deleteAlumnoFromCurso);

/**
 * @swagger
 * /api/cursos/{idCurso}/invitaciones:
 *   post:
 *    summary: Enviar correos de invitacion para unirse al curso o añadirlos si ya estan registrados
 *    tags: [Usuario]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              emails: ["juan@example.com", "ale@gmail.com"]
 *              token: 12d3dfsd435sdgfsdf.23423wfe.r2344fds
 *              enviarInvitacionSiExiste: false
 *    responses:
 *      204: 
 *        description: Se han enviado los correos/añadido exitosamente
 *      400:
 *        description: Datos incompletos o incorrectos
 *        content:
 *          application/json:
 *            example:
 *              error: Datos incompletos o incorrectos
 */
router.post("/:idCurso/invitaciones", controller.addOrSendInvitationToUsers);

export default router;
