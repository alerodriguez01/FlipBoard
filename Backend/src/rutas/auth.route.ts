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
 *      404:
 *        description: Error de correo sin formato o inexistente o contrasena incorrecta
 *        content:
 *          application/json:
 *            example:
 *              message: "Valor invalido para el atributo Correo o contrasena de Usuario"

 */
router.post('/login', controller.login)

export default router;