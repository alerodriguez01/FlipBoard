import { Router } from "express";
import controller from "../controladores/usuario.controller.js";

const router = Router();

/*
    Obtener usuario por id
*/
router.get("/:idUsuario", controller.getUsuarioById)

export default router;