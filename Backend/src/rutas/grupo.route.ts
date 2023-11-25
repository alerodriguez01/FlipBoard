import exp from "constants";
import { Router } from "express";
import grupoController from "../controladores/grupo.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Grupo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El id del grupo
 *         numero:
 *           type: number
 *           description: El numero de grupo
 *         integrantes:
 *           type: list
 *           description: Los integrantes del grupo
 *         cursoId:
 *           type: string
 *           description: El id del curso asociado al mural
 *       required:
 *         - numero
 *         - integrantes
 *         - cursoId
 *       example:
 *         id: 65326ed824fea7e06d01e20f
 *         numero: 1
 *         integrantes: [ "65326ed824fea7e06d01e207", "65326ed824fea7e06d01e208" ]
 *         cursoId: 65326ed824fea7e06d01e20b
 */

/**
 * @swagger
 * /api/cursos/{idCurso}/grupos:
 *   get:
 *    summary: Obtener grupos de un curso
 *    tags: [Grupo]
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
 *        description: Nombre y/o apellido de algun integrante del grupo a buscar
 *        schema:
 *          type: string
 *        example:
 *          Juan
 *      - name: limit
 *        in: query
 *        required: false
 *        description: Limite de grupos a obtener
 *        schema:
 *          type: number
 *        example:
 *          5
 *      - name: offset
 *        in: query
 *        required: false
 *        description: Numero de grupos a saltar
 *        schema:
 *          type: number
 *        example:
 *          5
 *    responses:
 *      200:
 *        description: Grupo/s encontrado/s
 *        content:
 *          application/json:
 *            example:
 *              count: 1
 *              result:
 *              - id: "653732252ce4b9810daa0d3a"
 *                numero: 1
 *                cursoId: "653732252ce4b9810daa0d36"
 *                integrantes:
 *                  - "653732252ce4b9810daa0d32"
 *                  - "653732252ce4b9810daa0d33"
 *                integrantesModel:
 *                  - id: "653732252ce4b9810daa0d32"
 *                    nombre: "juan"
 *                    correo: "juan@example.com"
 *                    contrasena: "$2a$10$SB353BlP/0rX1Y1gFEdy/e5y98KXnvbd5CHwP4o3Eyl2O5foSbXhy"
 *                    cursosAlumno:
 *                      - "653732252ce4b9810daa0d36"
 *                      - "653732252ce4b9810daa0d37"
 *                    cursosDocente:
 *                      - "653732252ce4b9810daa0d36"
 *                    grupos:
 *                      - "653732252ce4b9810daa0d3a"
 *                      - "653732252ce4b9810daa0d3b"
 *                  - id: "653732252ce4b9810daa0d33"
 *                    nombre: "maria"
 *                    correo: "maria@example.com"
 *                    contrasena: "$2a$10$QFpHVFcchnQfaS7s/sqXm.lO/hfKcf3mfqmUm9O0GehCyFxp7YJ9S"
 *                    cursosAlumno:
 *                      - "653732252ce4b9810daa0d37"
 *                    cursosDocente: []
 *                    grupos:
 *                      - "653732252ce4b9810daa0d3a"
 *      400:
 *        description: Valor invalido para idCurso
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo idCurso de Grupo
 */
router.get("/:idCurso/grupos", grupoController.getGruposFromCurso)

/**
 * @swagger
 * /api/cursos/{idCurso}/grupos:
 *   post:
 *    summary: Crear grupo en un curso
 *    tags: [Grupo]
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
 *      201:
 *        description: Grupo creado
 *        content:
 *          application/json:
 *            example:
 *              - id: "653999341a3b96d2024fc3f7"
 *                numero: 1
 *                cursoId: "6539977a733c7431679c3be4"
 *                integrantes:
 *                  - "65399776733c7431679c3be0"
 *                  - "6539977a733c7431679c3be2"
 *      400:
 *        description: Valor invalido para idCurso o id de integrante, o cantidad de integrantes invalida
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo NroIntegrantes de Grupo
 */
router.post("/:idCurso/grupos", grupoController.createGrupo);

/**
 * @swagger
 * /api/cursos/{idCurso}/grupos/{idGrupo}:
 *   delete:
 *     summary: Eliminar un Grupo del curso
 *     tags: [Grupo]
 *     parameters:
 *       - name: idGrupo
 *         in: path
 *         required: true
 *         description: El id del Grupo
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
 *         description: Grupo eliminado exitosamente
 *       400:
 *         description: El usuario no esta autorizado para eliminar el Grupo
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Docente' en 'Grupo'
 *       404:
 *         description: El Grupo no fue encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Grupo' en la BDD
 */
router.delete("/:idCurso/grupos/:idGrupo", grupoController.deleteGrupoFromCurso);

export default router;