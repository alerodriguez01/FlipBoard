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
 *           description: El room del mural colaborativo
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
 *         id: 65326ed824fea7e06d01e211
 *         nombre: Mural de Matemáticas
 *         contenido: 272e3f8041a653b15259,RlYB8Z0stMspXIrCEgzESA
 *         descripcion: Mural de matemáticas para el curso
 *         rubricaId: 65326ed824fea7e06d01e20d
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
 *      400:
 *        description: El parametro idMural es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idMural de Rubrica
 *      404:
 *        description: El mural no fue encontrado
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Mural' en la BDD
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
 *         description: Murales encontrados
 *         content:
 *           application/json:
 *               example:
 *                 murales:
 *                   - id: 653460ae39e91bc002bf42fb
 *                     nombre: Mural de Matemáticas
 *                     contenido: 272e3f8041a653b15259,RlYB8Z0stMspXIrCEgzESA
 *                     descripcion: Mural de matemáticas para el curso
 *                     rubricaId: 653460ae39e91bc002bf42f7
 *                     cursoId: 653460ae39e91bc002bf42f5                              
 *       400:
 *         description: Valor invalido para idCurso
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idCurso de Mural
 */
router.get("/:idCurso/murales", controller.getMuralesFromCurso);

/**
 * @swagger
 * /api/cursos/murales/{idMural}:
 *   put:
 *    summary: Actualizar un mural
 *    tags: [Mural]
 *    parameters:
 *      - name: idMural
 *        in: path
 *        required: true
 *        description: El id del mural
 *        schema:
 *          type: string
 *        example: 
 *          653968d5642003e96a382246
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            nombre: Mural de Matemáticas 
 *            descripcion: Mural de matemáticas para el curso (opcional)
 *            idRubrica: 65326ed824fea7e06d01e20d (opcional)
 *            idDocente: 65326ed824fea7e06d01e20c
 *            idCurso: 65326ed824fea7e06d01e20c
 *    responses:
 *      200:
 *        description: Mural actualizado exitosamente
 *      400:
 *        description: El parametro idMural o idRubrica o idDocente es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idRubrica o idMural o idDocente de Rubrica o Mural
 *      404:
 *        description: No se ha podido encontrar el mural o la rubrica
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Rubrica o Mural o Usuario' en la BDD
 */
// router.put("/murales/:idMural", controller.asociateRubricaToMural);
router.put("/murales/:idMural", controller.updateMural);

/**
 * @swagger
 * /api/cursos/{idCurso}/murales:
 *   post:
 *    summary: Crear un nuevo mural
 *    tags: [Mural]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          65326ed824fea7e06d01e20b
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nombre:
 *                type: string
 *                description: El nombre del mural
 *              descripcion:
 *                type: string
 *                description: La descripcion del mural
 *              contenido:
 *                type: string
 *                description: El room del mural colaborativo
 *              idRubrica:
 *                type: string
 *                description: El id de la rubrica asociada al mural
 *              idDocente:
 *                type: string
 *                description: El id del docente que crea el mural
 *            required:
 *              - nombre
 *              - contenido
 *              - idDocente
 *            example:
 *              nombre: Mural de Matemáticas
 *              contenido: 272e3f8041a653b15259,RlYB8Z0stMspXIrCEgzESA
 *              descripcion: Mural de matemáticas para el curso
 *              idRubrica: 65326ed824fea7e06d01e20d
 *              idDocente: 65326ed824fea7e06d01e20c
 *    responses:
 *      201: 
 *        description: Mural creado exitosamente
 *        content:
 *          application/json:
 *            example:
 *            - id: 653460ae39e91bc002bf42fb
 *              nombre: Mural de Matemáticas
 *              contenido: 272e3f8041a653b15259,RlYB8Z0stMspXIrCEgzESA
 *              descripcion: Mural de matemáticas para el curso
 *              rubricaId: 653460ae39e91bc002bf42f7
 *              cursoId: 653460ae39e91bc002bf42f5  
 *      400:
 *        description: Faltan datos obligatorios
 *        content:
 *          application/json:
 *            example:
 *              message: Faltan datos obligatorios
 *      404:
 *        description: No se encontro el curso o la rubrica
 *        content:
 *          application/json:
 *            example:
 *              message: No se ha podido encontrar 'Cusro o Rubrica' en la BDD
 */
router.post("/:idCurso/murales", controller.createMural);

/**
 * @swagger
 * /api/cursos/murales/{idMural}:
 *   delete:
 *     summary: Eliminar un mural por id  
 *     tags: [Mural]
 *     parameters:
 *       - name: idMural
 *         in: path
 *         required: true
 *         description: El id del mural
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
 *         description: Mural eliminado exitosamente
 *       400:
 *         description: El usuario no esta autorizado para eliminar el Mural
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Docente' en 'Mural'
 *       404:
 *         description: El Mural no fue encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Mural' en la BDD
 */
router.delete("/murales/:idMural", controller.deleteMuralById);

export default router;