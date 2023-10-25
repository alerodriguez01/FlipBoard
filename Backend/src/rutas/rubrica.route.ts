import { Router } from "express";
import controller from "../controladores/rubrica.controller.js";

const routerUsuario = Router(); // Router para rutas "/usuarios/rubricas"
const routerCurso = Router(); // Router para rutas "/cursos/rubricas"

/**
 * @swagger
 * components:
 *  schemas:
 *    Rubrica:
 *      type: object
 *      required:
 *        - nombre
 *        - criterios
 *        - niveles
 *        - usuarioId
 *      properties:
 *        id:
 *          type: string
 *          description: El id de la rubrica
 *        nombre:
 *          type: string
 *          description: El nombre de la rubrica
 *        criterios:
 *          type: array
 *          description: Los criterios de la rubrica
 *          items: 
 *            $ref: '#/components/schemas/Criterio'
 *        niveles:
 *          type: array
 *          description: Los niveles de la rubrica
 *          items:
 *            $ref: '#/components/schemas/Nivel'
 *        gruposCursos:
 *          type: list
 *          description: Todos los cursos donde se asocie la rubrica a grupos
 *        alumnosCursos:
 *          type: list
 *          description: Todos los cursos donde se asocie la rubrica a alumnos
 *        usuarioId:
 *          type: string
 *          description: El id del usuario que creo la rubrica
 *      example:
 *        id: 65326ed824fea7e06d01e20d,
 *        nombre: Rubrica de Matemáticas
 *        gruposCursos: [ "65326ed824fea7e06d01e20b" ]
 *        alumnosCursos: [ "65326ed824fea7e06d01e20b" ]
 *        usuarioId: 65326ed824fea7e06d01e207
 *        criterios: [
 *            {
 *              "nombre": "Precisión",
 *              "descripciones": [
 *                  "Muy preciso",
 *                  "Preciso",
 *                  "Poco preciso"
 *              ]
 *            },
 *            {
 *              "nombre": "Complejidad",
 *              "descripciones": [
 *                  "Muy complejo",
 *                  "Complejo",
 *                  "Poco complejo"
 *              ]
 *            }
 *        ]
 *        niveles: [
 *            {
 *              "nombre": "Nivel 1",
 *              "puntaje": 1
 *            },
 *            {
 *              "nombre": "Nivel 2",
 *              "puntaje": 2
 *            },
 *            {
 *              "nombre": "Nivel 3",
 *              "puntaje": 3
 *            }
 *        ]
 * 
 * 
 *    Criterio:
 *      type: object 
 *      properties:
 *        nombre:
 *          type: string
 *          description: El nombre del criterio
 *        descripciones:
 *          type: list
 *          description: Las descripciones del criterio
 *      required:
 *        - nombre
 *        - descripciones
 *      example:
 *        nombre: Precisión
 *        descripciones: [ "Muy preciso", "Preciso", "Poco preciso" ]
 * 
 *    Nivel:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: El nombre del nivel
 *        puntaje:
 *          type: number
 *          description: El puntaje del nivel
 *      required:
 *        - nombre
 *      example:
 *        nombre: Nivel 1
 *        puntaje: 1
 * 
 */

// ------------ Rutas correspondientes a /usuarios ------------

/**
 * @swagger
 * /api/usuarios/rubricas/{idRubrica}:
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
 *             schema:
 *               $ref: '#/components/schemas/Rubrica'
 *       404:
 *         description: No se encontro el rubrica o es invalido el idRubrica
 *         content:
 *           application/json:
 *             examples:
 *               rubricaNoEncontrado:
 *                 value:
 *                   error: No se ha podido encontrar 'Rubrica' en la BDD
 *               idRubricaInvalido:
 *                 value:
 *                   error: Valor invalido para el atributo idRubrica de Rubrica
 */
routerUsuario.get("/rubricas/:idRubrica", controller.getRubricaById);

/**
 * @swagger
 * /api/usuarios/rubricas:
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
routerUsuario.post("/rubricas", controller.createRubrica);

// TODO - ID16 - Traer rúbricas de un usuario (por usuarioId)
routerUsuario.get("/:idUsuario/rubricas/")

// ------------ Rutas correspondientes a /cursos ------------

// TODO - ID12 - Cargar curso con lista rubricasAlumnos (traer cada rúbrica con todos los campos).
routerCurso.get("/:idCurso/rubricas/alumnos")

// TODO - ID13 - Cargar curso con lista rubricasGrupos (traer cada rúbrica con todos los campos).
routerCurso.get("/:idCurso/rubricas/grupos")

// TODO - ID19 - Asignar rúbrica a todos los participantes (alumnos) del curso: en rúbrica, hay que agregar el cursoId a la lista de alumnosCursos
routerCurso.put("/:idCurso/rubricas/alumnos")

// TODO - ID20 - Asignar rúbrica a todos los grupos del curso: en rúbrica, hay que agregar el cursoId a la lista de gruposCursos
routerCurso.put("/:idCurso/rubricas/grupos")


export { routerUsuario, routerCurso };