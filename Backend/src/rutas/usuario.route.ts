import { Router } from "express";
import controller from "../controladores/usuario.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      required:
 *        - nombre
 *        - correo
 *        - contrasena
 *      properties:
 *        id:
 *          type: string
 *          description: El id del usuario
 *        nombre:
 *          type: string
 *          description: El nombre y apellido del usuario
 *        correo:
 *          type: string
 *          description: El correo del usuario
 *        contrasena:
 *          type: string
 *          description: La contrasena del usuario
 *        cursosAlumno:
 *          type: list
 *          description: Los cursos en los que el usuario es alumno
 *        cursosDocente:
 *          type: list
 *          description: Los cursos en los que el usuario es docente
 *        grupos:
 *          type: list
 *          description: Los grupos a los que pertenece el usuario
 *      example:
 *        id: 65332c7596d166519a96572f
 *        nombre: Juan
 *        correo: juan@examplee.com
 *        contrasena: $2a$15$XGG1OEh6HucNKLYOV/56b.5wY.Z6dQw.Ho4E1/Vgw5T87csmYpWLm
 *        cursosAlumno: ["65326ed824fea7e06d01e20b", "65326ed824fea7e06d01e20c"]
 *        cursosDocente: ["65326ed824fea7e06d01e20b"]
 *        grupos: ["65326ed824fea7e06d01e20f", "65326ed824fea7e06d01e210"]
 */

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   get:
 *     summary: Obtener un usuario por id  
 *     tags: [Usuario]
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: El id del usuario
 *         schema:
 *           type: string
 *         example:
 *           65326ed824fea7e06d01e207
 *       - name: cursos
 *         in: query
 *         required: false
 *         description: Indica si se quieren obtener los cursos del usuario
 *         schema:
 *           type: boolean
 *         example:
 *           true
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Usuario"
 *       404:
 *         description: No se encontro el usuario
 *         content:
 *           application/json:
 *             example:
 *               message: No se ha podido encontrar 'Usuario' en la BDD
 */

router.get("/:idUsuario", controller.getUsuarioById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *    summary: Crear un nuevo usuario
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            nombre: Juan
 *            correo: juanperez@gmail.com
 *            contrasena: Contra123456
 *    responses:
 *      201: 
 *        description: Usuario creado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Usuario"
 *      400:
 *        description: Faltan datos obligatorios o el correo ya existe
 *        content:
 *          application/json:
 *            examples:
 *              faltanDatos:
 *                value:
 *                  message: Faltan datos obligatorios
 *              correoYaExiste:
 *                value:
 *                  message: Valor invalido para el atributo Correo de Usuario
 */
router.post("/", controller.createUsuario);

export default router;