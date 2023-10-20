import { Router } from 'express';
import controller from '../controladores/auth.controller.js';

const router = Router();

/*
    Login de usuario
    body {
        correo: string,
        contrasena: string
    }
*/
router.post('/login', controller.login)

export default router;