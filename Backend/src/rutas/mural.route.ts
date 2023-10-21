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
 * /api/murales/{idMural}:
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
router.get("/:idMural", controller.getMuralById);

export default router;