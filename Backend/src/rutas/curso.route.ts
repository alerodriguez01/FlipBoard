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
 *       404:
 *         description: No se encontro el curso
 *         content:
 *           application/json:
 *             example:
 *               message: No se ha podido encontrar 'Curso' en la BDD
 */
router.get("/cursos/:idCurso", controller.getCursoById);

/**
 * @swagger
 * /api/cursos/{idCurso}/murales:
 *   get:
 *     summary: Obtener los murales de un curso  
 *     tags: [Curso]
 *     parameters:
 *       - name: idCurso
 *         in: path
 *         required: true
 *         description: El id del curso
 *         schema:
 *           type: string
 *         example:
 *           653460ae39e91bc002bf42f5
 *       - name: rubrica
 *         in: query
 *         required: false
 *         description: Indica si se quieren obtener la rubrica de cada mural
 *         schema:
 *           type: boolean
 *         example:
 *           true
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *               example:
 *                 id: 653460ae39e91bc002bf42f5
 *                 nombre: Curso de Matemáticas
 *                 tema: Matemáticas Avanzadas
 *                 sitioWeb: https://matematicas.com
 *                 descripcion: Un curso de matemáticas avanzadas
 *                 emailContacto: contacto@matematicas.com
 *                 participantes:
 *                   - 653460ae39e91bc002bf42f1
 *                 docentes:
 *                   - 653460ae39e91bc002bf42f1
 *                 rubricasGrupos:
 *                   - 653460ae39e91bc002bf42f7
 *                 rubricasAlumnos:
 *                   - 653460ae39e91bc002bf42f7
 *                 murales:
 *                   - id: 653460ae39e91bc002bf42fb
 *                     nombre: Mural de Matemáticas
 *                     contenido: Contenido del mural de matemáticas
 *                     descripcion: Mural de matemáticas para el curso
 *                     rubricaId: 653460ae39e91bc002bf42f7
 *                     cursoId: 653460ae39e91bc002bf42f5                              
 *       404:
 *         description: No se encontro el curso
 *         content:
 *           application/json:
 *             example:
 *               message: No se ha podido encontrar 'Curso' en la BDD
 */
router.get("/cursos/:idCurso/murales", controller.getCursoByIdWithMurales);

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

export default router;