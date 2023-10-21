import { Router } from "express";
import controller from "../controladores/rubrica.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Rubrica:
 */

/**
 * @swagger
 * /api/rubricas/{idRubrica}:
 *   get:
 *     summary: Obtener una rubrica por id
 *     tags: [Rubrica]
 *     parameters:
 *       - name: idRubrica
 *         in: path
 *         required: true
 *         description: El id de la rubrica a obtener
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20d
 *     responses:
 *       200:
 *         description: Rubrica encontrada
 *         content:
 *           application/json:
 *             example:
 *               id: 65326ed824fea7e06d01e20d,
 *               nombre: Rubrica de Matemáticas
 *               gruposCursos: [ "65326ed824fea7e06d01e20b" ]
 *               alumnosCursos": [ "65326ed824fea7e06d01e20b" ]
 *               usuarioId: 65326ed824fea7e06d01e207
 *               criterios: [
 *                   {
 *                     "nombre": "Precisión",
 *                     "descripciones": [
 *                         "Muy preciso",
 *                         "Preciso",
 *                         "Poco preciso"
 *                     ]
 *                   },
 *                   {
 *                     "nombre": "Complejidad",
 *                     "descripciones": [
 *                         "Muy complejo",
 *                         "Complejo",
 *                         "Poco complejo"
 *                     ]
 *                   }
 *               ]
 *               niveles: [
 *                   {
 *                     "nombre": "Nivel 1",
 *                     "puntaje": 1
 *                   },
 *                   {
 *                     "nombre": "Nivel 2",
 *                     "puntaje": 2
 *                   },
 *                   {
 *                     "nombre": "Nivel 3",
 *                     "puntaje": 3
 *                   }
 *               ]
 *       404:
 *         description: No se encontro la rubrica
 *         content:
 *           application/json:
 *             example:
 *              message: No se ha podido encontrar 'Rubrica' en la BDD
 */
router.get("/:idRubrica", controller.getRubricaById);

/**
 * @swagger
 * /api/rubricas:
 *   post:
 *     summary: Crear una rubrica
 *     tags: [Rubrica]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Mi rubrica 123
 *             criterios: [
 *               { nombre: "c1",
 *                 descripciones: ["d1", "d2", "d3"]
 *               },
 *               { nombre: "c2",
 *                 descripciones: ["d4", "d5", "d6"]
 *               },
 *             ]
 *             niveles: [
 *               {nombre: "n1"},
 *               {nombre: "n2"},
 *               {nombre: "n3"},
 *             ]
 *             usuarioId: 65326ed824fea7e06d01e207
 *     responses:
 *       201: 
 *         description: Rubrica creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               criterios: [
 *                   {
 *                   "nombre": "c1",
 *                   "descripciones": ["d1", "d2", "d3" ]
 *                   },
 *                   {
 *                   "nombre": "c2",
 *                   "descripciones": ["d4","d5", "d6" ]
 *                   }
 *               ]
 *               niveles: [
 *                   {
 *                   "nombre": "n1",
 *                   "puntaje": null
 *                   },
 *                   {
 *                   "nombre": "n2",
 *                   "puntaje": null
 *                   },
 *                   {
 *                   "nombre": "n3",
 *                   "puntaje": null
 *                   }
 *               ]
 *               id: 653344ad70fbf22423534796
 *               nombre: Mi rubrica 123
 *               gruposCursos: []
 *               alumnosCursos: []
 *               usuarioId: 65326ed824fea7e06d01e207
 *       400:
 *         description: Faltan datos obligatorios o el correo ya existe
 *         content:
 *           application/json:
 *             examples:
 *               faltanDatos:
 *                 value:
 *                   message: Rubrica invalida
 *               usuarioAsociadoIncorrecto:
 *                 value:
 *                   message: No se ha podido encontrar 'Usuario' en la BDD
 */
router.post("/", controller.createRubrica);

export default router;