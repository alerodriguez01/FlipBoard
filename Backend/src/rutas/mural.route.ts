import { Router } from "express";
import controller from "../controladores/mural.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Mural:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El id del mural
 *         nombre:
 *           type: string
 *           description: El nombre del mural
 *         descripcion:
 *           type: string
 *           description: La descripcion del mural
 *         contenido:
 *           type: string
 *           description: El contenido del mural
 *         rubricaId:
 *           type: string
 *           description: El id de la rubrica asociada al mural
 *         cursoId:
 *           type: string
 *           description: El id del curso asociado al mural
 *       required:
 *         - nombre
 *         - contenido
 *         - cursoId
 *       example:
 *         id: 65326ed824fea7e06d01e211,
 *         nombre: Mural de Matemáticas,
 *         contenido: Contenido del mural de matemáticas,
 *         descripcion: Mural de matemáticas para el curso,
 *         rubricaId: 65326ed824fea7e06d01e20d,
 *         cursoId: 65326ed824fea7e06d01e20b
 */


/**
 * @swagger
 * /api/cursos/murales/{idMural}:
 *   get:
 *    summary: Obtener un mural por id
 *    tags: [Mural]
 *    parameters:
 *      - name: idMural
 *        in: path
 *        required: true
 *        description: El id del mural
 *        schema:
 *          type: string
 *        example: 
 *          65326ed824fea7e06d01e211
 *      - name: rubrica
 *        in: query
 *        required: false
 *        description: Indica si se quieren obtener la rubrica del mural
 *        schema:
 *          type: boolean
 *        example:
 *          true
 *    responses:
 *      200:
 *        description: Mural encontrado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Mural'
 *      404:
 *        description: No se encontro el mural
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Mural' en la BDD
 */
router.get("/murales/:idMural", controller.getMuralById);

/**
 * @swagger
 * /api/cursos/{idCurso}/murales:
 *   get:
 *     summary: Obtener los murales de un curso  
 *     tags: [Mural]
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
router.get("/:idCurso/murales", controller.getMuralesFromCurso);

// TODO - ID18 - Asignar rúbrica a un mural (actualizar el mural con el valor de rúbricaId)
router.put("/murales/:idMural")

// TODO - ID21 - Crear mural
router.post("/murales")

export default router;