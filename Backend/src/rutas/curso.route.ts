import { Router } from "express";
import controller from "../controladores/curso.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Curso:
 *      type: object
 *      required:
 *        - nombre
 *        - emailContacto
 *      properties:
 *        id:
 *          type: string
 *          description: El id del curso
 *        nombre:
 *          type: string
 *          description: El nombre del curso
 *        tema:
 *          type: string
 *          description: El tema del curso
 *        sitioWeb:
 *          type: string
 *          description: El sitio web del curso
 *        descripcion:
 *          type: string
 *          description: La descripcion del curso
 *        emailContacto:
 *          type: string
 *          description: El email de contacto del curso
 *        participantes:
 *          type: list
 *          description: Los participantes (alumnos) del curso
 *        docentes:
 *          type: list
 *          description: Los docentes del curso
 *        rubricasGrupos:
 *          type: list
 *          description: Todas las rubricas asociadas a los grupos en el curso
 *        rubricasAlumnos:
 *          type: list
 *          description: Todas las rubricas asociadas a los alumnos en el curso
 *      example:
 *        id: 65326ed824fea7e06d01e20b
 *        nombre: Curso de Matemáticas
 *        tema: Matemáticas Avanzadas
 *        sitioWeb: https://matematicas.com
 *        descripcion: Curso de matemáticas avanzadas
 *        emailContacto: contacto@matematicas.com
 *        participantes: ["65326ed824fea7e06d01e207"]
 *        docentes: ["65326ed824fea7e06d01e207"]
 *        rubricasGrupos: ["65326ed824fea7e06d01e20d"]
 *        rubricasAlumnos: ["65326ed824fea7e06d01e20d"]
 */


/**
 * @swagger
 * /api/cursos/{idCurso}:
 *   get:
 *     summary: Obtener un curso por id  
 *     tags: [Curso]
 *     parameters:
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20b
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Curso"
 *       400:
 *         description: El parametro idCurso es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idCurso de Rubrica
 *       404:
 *         description: El curso no fue encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Curso' en la BDD
 */
router.get("/cursos/:idCurso", controller.getCursoById);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *    summary: Crear un nuevo curso
 *    tags: [Curso]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            nombre: Curso de Matemáticas
 *            tema: Matemáticas Avanzadas
 *            sitioWeb: https://matematicas.com
 *            descripcion: Curso de matemáticas avanzadas
 *            emailContacto: contacto@matematicas.com
 *            docentes: ["65326ed824fea7e06d01e207"]
 *    responses:
 *      201: 
 *        description: Curso creado exitosamente
 *        content:
 *          application/json:
 *            example:
 *              id: 65326ed824fea7e06d01e20b
 *              nombre: Curso de Matemáticas
 *              tema: Matemáticas Avanzadas
 *              sitioWeb: https://matematicas.com
 *              descripcion: Curso de matemáticas avanzadas
 *              emailContacto: contacto@matematicas.com
 *              docentes: ["65326ed824fea7e06d01e207"]
 *              rubricasGrupos: []
 *              rubricasAlumnos: []
 *              participantes: []
 *      400:
 *        description: Faltan datos obligatorios
 *        content:
 *          application/json:
 *            example:
 *              message: Faltan datos obligatorios
 *      404:
 *        description: No se encontro el docente
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Docente' en la BDD
 */
router.post("/cursos", controller.saveCurso);

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Obtener todos los cursos  
 *     tags: [Curso]
 *     responses:
 *       200:
 *         description: Cursos encontrados
 *         content:
 *           application/json:
 *               example:
 *                 - id: "653732252ce4b9810daa0d36"
 *                   nombre: "Curso de Matemáticas"
 *                   tema: "Matemáticas Avanzadas"
 *                   sitioWeb: "https://matematicas.com"
 *                   descripcion: "Un curso de matemáticas avanzadas"
 *                   emailContacto: "contacto@matematicas.com"
 *                   participantes:
 *                     - "653732252ce4b9810daa0d32"
 *                   docentes:
 *                     - "653732252ce4b9810daa0d32"
 *                   rubricasGrupos:
 *                     - "653732252ce4b9810daa0d38"
 *                   rubricasAlumnos:
 *                     - "653732252ce4b9810daa0d38"
 *                 - id: "653732252ce4b9810daa0d37"
 *                   nombre: "Curso de Historia"
 *                   tema: "Historia del Mundo"
 *                   sitioWeb: "https://historia.com"
 *                   descripcion: "Un curso de historia global"
 *                   emailContacto: "contacto@historia.com"
 *                   participantes:
 *                     - "653732252ce4b9810daa0d32"
 *                     - "653732252ce4b9810daa0d33"
 *                   docentes: []
 *                   rubricasGrupos:
 *                     - "653732252ce4b9810daa0d39"
 *                   rubricasAlumnos:
 *                     - "653732252ce4b9810daa0d39"
 */
router.get("/cursos", controller.getCursos);

/**
 * @swagger
 * /api/cursos/send-email:
 *   post:
 *    summary: Enviar correos de invitacion para unirse al curso
 *    tags: [Curso]
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              emails: ["juan@example.com", "ale@gmail.com"]
 *              token: 12d3dfsd435sdgfsdf.23423wfe.r2344fds
 *              idCurso: 1ds45435343242wer
 *              nombre: "Curso de Matemáticas"
 *    responses:
 *      204: 
 *        description: Se han enviado los correos exitosamente
 *      400:
 *        description: Datos incompletos o incorrectos
 *        content:
 *          application/json:
 *            example:
 *              error: Datos incompletos o incorrectos
 */
router.post("/cursos/send-email", controller.sendEmailToUsers);


/**
 * @swagger
 * /api/cursos/{idCurso}:
 *   delete:
 *     summary: Eliminar un curso por id  
 *     tags: [Curso]
 *     parameters:
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
 *         description: Curso eliminado exitosamente
 *       400:
 *         description: El usuario no esta autorizado para eliminar el curso
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Docente' en 'Curso'
 *       404:
 *         description: El curso no fue encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Curso' en la BDD
 */
router.delete("/cursos/:idCurso", controller.deleteCursoById);

export default router;