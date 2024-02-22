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
 *       400:
 *         description: El parametro idUsuario es invalido
 *         content:
 *           application/json:
 *             example:
 *               error: Valor invalido para el atributo idUsuario de Usuario
 *       404:
 *         description: El usuario no fue encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: No se ha podido encontrar 'Usuario' en la BDD
 */
router.get("/usuarios/:idUsuario", controller.getUsuarioById);

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
router.post("/usuarios", controller.createUsuario);

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   patch:
 *    summary: Actualizar un usuario (solo lo puede realizar un superuser o el usuario a si mismo)
 *    parameters:
 *      - name: idUsuario
 *        in: path
 *        required: true
 *        description: El id del usuario
 *        schema:
 *          type: string
 *        example:
 *          65326ed824fea7e06d01e207
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            nombre: Juan
 *            contrasena: Contra123456
 *            superUser: true
 *    responses:
 *      201: 
 *        description: Usuario actualizado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Usuario"
 *      400:
 *        description: Valor invalido para el atributo nombre o password
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo Correo de Usuario
 *      404:
 *        description: Usuario no encontrado
 *        content:
 *          application/json:
 *            examples:
 *              usuarioNoEncontrado:
 *                value:
 *                  error: No se ha podido encontrar 'Usuario' en la BDD
 *              faltaDatos:
 *                value:
 *                  error: El body no contiene los campos necesarios
 */
router.patch("/usuarios/:idUsuario", controller.updateUsuario);

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   delete:
 *    summary: Eliminar un usuario (solo lo puede realizar un superuser)
 *    parameters:
 *      - name: idUsuario
 *        in: path
 *        required: true
 *        description: El id del usuario
 *        schema:
 *          type: string
 *        example:
 *          65326ed824fea7e06d01e207
 *    tags: [Usuario]
 *    responses:
 *      204: 
 *        description: Usuario actualizado exitosamente
 *      401:
 *        description: No tiene permisos para realizar esta accion
 *        content:
 *          application/json:
 *            example:
 *              error: No tiene permisos para realizar esta accion
 *      404:
 *        description: Usuario no encontrado
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Usuario' en la BDD
 */
router.delete("/usuarios/:idUsuario", controller.deleteUsuario);

/**
 * @swagger
 * /api/usuarios/{idUsuario}/password:
 *   put:
 *    summary: Cambiar la contraseña de un usuario
 *    tags: [Usuario]
 *    parameters:
 *      - name: idUsuario
 *        in: path
 *        required: true
 *        description: el id del usuario
 *        schema:
 *          type: string
 *          example:
 *            65397634490a7145b8387808
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDE0OTcxMGRjOWU3YjlhZWFiNzk0NSIsImlhdCI6MTY5ODc5MTMxOSwiZXhwIjoxNjk4NzkyMjE5fQ.GbYurUUWyDB1I0GMIPRrDLqNRw0Xy5ILbeFdLu4_9ns
 *            contrasena: NuevaPassword321
 *    responses:
 *      200: 
 *        description: Contraseña actualizada exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Usuario"
 *      400:
 *        description: Faltan datos obligatorios, la contraseña es invalida o el idUsuario es invalido
 *        content:
 *          application/json:
 *            examples:
 *              faltanDatos:
 *                value:
 *                  message: Faltan datos obligatorios
 *              contrasenaInvalida:
 *                value:
 *                  message: Valor invalido para el atributo Contrasenia de Usuario
 *      401:
 *        description: Token invalido
 *      404:
 *        description: Usuario o Salt no encontrado
 */
router.put("/usuarios/:idUsuario/password", controller.updateUsuarioPassword);


/**
 * @swagger
 * /api/usuarios:
 *   get:
 *    summary: Obtener todos los usuarios de la plataforma
 *    tags: [Usuario]
 *    parameters:
 *      - name: nombre
 *        in: query
 *        required: false
 *        description: Nombre y/o apellido del usuario a buscar
 *        schema:
 *          type: string
 *        example:
 *          Juan
 *      - name: limit
 *        in: query
 *        required: false
 *        description: Limite de usuarios a obtener
 *        schema:
 *          type: number
 *        example:
 *          5
 *      - name: offset
 *        in: query
 *        required: false
 *        description: Numero de usuarios a saltar
 *        schema:
 *          type: number
 *        example:
 *          5
 *    responses:
 *      200:
 *        description: Usuarios encontrados
 *        content:
 *          application/json:
 *            example:
 *              count: 10
 *              result:
 *              - id: "653460ae39e91bc002bf42f1"
 *                nombre: "Juan"
 *                correo: "juan@example.com"
 *                contrasena: "$2a$10$RSPl7lG2beDJMvGZSpOcC./0oe4aFSILusGYZUFIKjNwhRFGSQEq6"
 *                cursosAlumno:
 *                  - "653460ae39e91bc002bf42f5"
 *                  - "653460ae39e91bc002bf42f6"
 *                cursosDocente:
 *                  - "653460ae39e91bc002bf42f5"
 *                  - "65368e734dcb343388ce78a1"
 *                grupos:
 *                  - "653460ae39e91bc002bf42f9"
 *                  - "653460ae39e91bc002bf42fa"
 *              
 *              - id: "653460ae39e91bc002bf42f2"
 *                nombre: "Maria"
 *                correo: "maria@example.com"
 *                contrasena: "$2a$10$tzUI6s7ajVJIM2ukmwhed.CZACun7iDJcGAwu3g4jLZaYBK/vSdtS"
 *                cursosAlumno:
 *                  - "653460ae39e91bc002bf42f6"
 *                cursosDocente: []
 *                grupos:
 *                  - "653460ae39e91bc002bf42f9"
 *      401:
 *        description: El usuario no esta autorizado o expiro su token
 *        content:
 *          application/json:
 *            example:
 *              error: Token expirado o no valido 
 *      500:
 *        description: Ha ocurrido un error imprevisto
 *        content:
 *          application/json:
 *            example:
 *              error: Ocurrio un problema inesperado 
*/
router.get("/usuarios", controller.getAllUsuarios);

export default router;