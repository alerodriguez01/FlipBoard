import { Router } from "express";
import controller from "../controladores/usuario.controller.js"

const router = Router();

/**
 * @swagger
 * /api/cursos/{idCurso}/alumnos:
 *   get:
 *    summary: Obtener alumnos de un curso
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
 *      404:
 *        description: No se encontro el curso
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Curso' en la BDD
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

export default router;
