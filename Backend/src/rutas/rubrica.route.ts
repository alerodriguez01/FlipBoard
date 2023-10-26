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
 *       400:
 *         description: El parametro idRubrica es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idRubrica de Rubrica
 *       404:
 *         description: La rubrica no fue encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Mural' en la BDD
 */
routerUsuario.get("/rubricas/:idRubrica", controller.getRubricaById);

/**
 * @swagger
 * /api/usuarios/{idUsuario}/rubricas:
 *   post:
 *     summary: Crear una rubrica
 *     tags: [Rubrica]
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: El id del usuario que crea la rubrica
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e20d
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
 *       400:
 *         description: El idUsuario es invalido, faltan datos obligatorios o los datos de la rubrica son invalidos
 *         content:
 *           application/json:
 *             example:
 *               error: Rubrica invalida
 *       404:
 *         description: No se ha podido encontrar el usuario
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Usuario' en la BDD
 */
routerUsuario.post("/:idUsuario/rubricas", controller.createRubrica);

/**
 * @swagger
 * /api/usuarios/{idUsuario}/rubricas:
 *   get:
 *    summary: Obtener todas las rubricas de un usuario
 *    tags: [Rubrica]
 *    parameters:
 *      - name: idUsuario
 *        in: path
 *        required: true
 *        description: El id del usuario
 *        schema:
 *          type: string
 *        example: 
 *          65326ed824fea7e06d01e211
 *    responses:
 *      200:
 *        description: Rubricas encontradas
 *        content:
 *          application/json:
 *            example:
 *              - criterios:
 *                  - nombre: Precisión
 *                    descripciones:
 *                      - Muy preciso
 *                      - Preciso
 *                      - Poco preciso
 *                  - nombre: Complejidad
 *                    descripciones:
 *                      - Muy complejo
 *                      - Complejo
 *                      - Poco complejo
 *                niveles:
 *                  - nombre: Nivel 1
 *                    puntaje: 1
 *                  - nombre: Nivel 2
 *                    puntaje: 2
 *                  - nombre: Nivel 3
 *                    puntaje: 3
 *                id: 653968d5642003e96a382248
 *                nombre: Rubrica de Matemáticas
 *                gruposCursos:
 *                  - 653968d5642003e96a382246
 *                alumnosCursos:
 *                  - 653968d5642003e96a382246
 *                usuarioId: 653968d5642003e96a382242
 *      400:
 *        description: El parametro idUsuario es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idUsuario de Usuario
 */
routerUsuario.get("/:idUsuario/rubricas/", controller.getAllRubricasByUserId);

// ------------ Rutas correspondientes a /cursos ------------

/**
 * @swagger
 * /api/cursos/{idCurso}/rubricas/alumnos:
 *   get:
 *    summary: Obtener todas las rubricas del curso asociadas a alumnos
 *    tags: [Rubrica]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          653968d5642003e96a382246
 *    responses:
 *      200:
 *        description: Rubricas encontradas
 *        content:
 *          application/json:
 *            example:
 *              - criterios:
 *                  - nombre: Precisión
 *                    descripciones:
 *                      - Muy preciso
 *                      - Preciso
 *                      - Poco preciso
 *                  - nombre: Complejidad
 *                    descripciones:
 *                      - Muy complejo
 *                      - Complejo
 *                      - Poco complejo
 *                niveles:
 *                  - nombre: Nivel 1
 *                    puntaje: 1
 *                  - nombre: Nivel 2
 *                    puntaje: 2
 *                  - nombre: Nivel 3
 *                    puntaje: 3
 *                id: 653968d5642003e96a382248
 *                nombre: Rubrica de Matemáticas
 *                gruposCursos:
 *                  - 653968d5642003e96a382246
 *                alumnosCursos:
 *                  - 653968d5642003e96a382246
 *                usuarioId: 653968d5642003e96a382242
 *      400:
 *        description: El parametro idCurso es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idCurso de Curso
 *      404:
 *        description: No se ha podido encontrar el curso
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Curso' en la BDD
 */
routerCurso.get("/:idCurso/rubricas/alumnos", controller.getRubricasAlumnosFromCurso);

/**
 * @swagger
 * /api/cursos/{idCurso}/rubricas/grupos:
 *   get:
 *    summary: Obtener todas las rubricas del curso asociadas a grupos
 *    tags: [Rubrica]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          653968d5642003e96a382246
 *    responses:
 *      200:
 *        description: Rubricas encontradas
 *        content:
 *          application/json:
 *            example:
 *              - criterios:
 *                  - nombre: Precisión
 *                    descripciones:
 *                      - Muy preciso
 *                      - Preciso
 *                      - Poco preciso
 *                  - nombre: Complejidad
 *                    descripciones:
 *                      - Muy complejo
 *                      - Complejo
 *                      - Poco complejo
 *                niveles:
 *                  - nombre: Nivel 1
 *                    puntaje: 1
 *                  - nombre: Nivel 2
 *                    puntaje: 2
 *                  - nombre: Nivel 3
 *                    puntaje: 3
 *                id: 653968d5642003e96a382248
 *                nombre: Rubrica de Matemáticas
 *                gruposCursos:
 *                  - 653968d5642003e96a382246
 *                alumnosCursos:
 *                  - 653968d5642003e96a382246
 *                usuarioId: 653968d5642003e96a382242
 *      400:
 *        description: El parametro idCurso es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idCurso de Curso
 *      404:
 *        description: No se ha podido encontrar el curso
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Curso' en la BDD
 */
routerCurso.get("/:idCurso/rubricas/grupos", controller.getRubricasGruposFromCurso)

/**
 * @swagger
 * /api/cursos/{idCurso}/rubricas/alumnos:
 *   put:
 *    summary: Asociar una rubrica a todos los alumnos del curso
 *    tags: [Rubrica]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          653968d5642003e96a382246
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            idRubrica: 653968d5642003e96a382248
 *    responses:
 *      204:
 *        description: Rubrica asociada exitosamente
 *      400:
 *        description: El parametro idCurso o idRubrica es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idRubrica o idCurso de Rubrica o Curso
 *      404:
 *        description: No se ha podido encontrar el curso o la rubrica
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Rubrica o Curso' en la BDD
 */
routerCurso.put("/:idCurso/rubricas/alumnos", controller.asociateRubricaAlumnosToCurso)

/**
 * @swagger
 * /api/cursos/{idCurso}/rubricas/grupos:
 *   put:
 *    summary: Asociar una rubrica a todos los grupos del curso
 *    tags: [Rubrica]
 *    parameters:
 *      - name: idCurso
 *        in: path
 *        required: true
 *        description: El id del curso
 *        schema:
 *          type: string
 *        example: 
 *          653968d5642003e96a382246
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            idRubrica: 653968d5642003e96a382248
 *    responses:
 *      204:
 *        description: Rubrica asociada exitosamente
 *      400:
 *        description: El parametro idCurso o idRubrica es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idRubrica o idCurso de Rubrica o Curso
 *      404:
 *        description: No se ha podido encontrar el curso o la rubrica
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Rubrica o Curso' en la BDD
 */
routerCurso.put("/:idCurso/rubricas/grupos", controller.asociateRubricaGruposToCurso)


export { routerUsuario, routerCurso };