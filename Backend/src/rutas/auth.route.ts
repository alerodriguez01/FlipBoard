import { Router } from 'express';
import controller from '../controladores/auth.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Auth:
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *    summary: Iniciar sesion
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            correo: juanperez@gmail.com
 *            contrasena: Contra123456
 *    parameters:
 *      - name: token
 *        in: cookie
 *        required: false
 *        description: JWT del usuario si ya inicio sesion
 *        schema:
 *          type: string
 *        example:
 *          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *    responses:
 *      200: 
 *        description: Usuario inicio sesion exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Usuario"
 *        headers:
 *          cookie.token:
 *            description: JWT del usuario
 *            type: string
 *      400:
 *        description: Datos incompletos 
 *        content:
 *          application/json:
 *            example:
 *              message: Datos incompletos
 *      401:
 *        description: Token invalido o expirado 
 *        content:
 *          application/json:
 *            example:
 *              message: Token expirado o no valido
 *      404:
 *        description: Error de correo sin formato o inexistente o contrasena incorrecta
 *        content:
 *          application/json:
 *            example:
 *              message: "Valor invalido para el atributo Correo o contrasena de Usuario"

 */
router.post('/login', controller.login)

/**
 * @swagger
 * /api/auth/{provider}/login:
 *   post:
 *    summary: Iniciar sesion con algún proveedor (por ejemplo, Google)
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            id: 109461709516461777805
 *            nombre: Juan Perez
 *            correo: juanperez@gmail.com
 *    parameters:
 *      - name: provider
 *        in: path
 *        required: true
 *        description: Proveedor de autenticación
 *        schema:
 *          type: string
 *        example:
 *          google
 *    responses:
 *      200: 
 *        description: Usuario inicio sesion/registro exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Usuario"
 *      400:
 *        description: Faltan campos obligatorios
 *        content:
 *          application/json:
 *            example:
 *              error: Faltan campos obligatorios

 */
router.post('/:provider/login', controller.loginProvider)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *    summary: Cerrar sesion
 *    tags: [Auth]
 *    parameters:
 *      - name: token
 *        in: cookie
 *        required: false
 *        description: JWT del usuario si ya inicio sesion
 *        schema:
 *          type: string
 *        example:
 *          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *    responses:
 *      204: 
 *        description: Usuario cerro sesion exitosamente
 */
router.post('/logout', controller.logout)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *    summary: Enviar mail para reestablecer contraseña
 *    tags: [Auth]
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              correo: juan@example.com
 *    responses:
 *      204: 
 *        description: Se ha enviado el mail exitosamente
 *      400:
 *        description: El parametro correo es invalido
 *        content:
 *          application/json:
 *            example:
 *              error: Valor invalido para el atributo correo de Usuario
 *      404:
 *        description: El usuario no fue encontrado
 *        content:
 *          application/json:
 *            example:
 *              error: No se ha podido encontrar 'Usuario' en la BDD
 */
router.post('/reset-password', controller.resetPassword);

export default router;