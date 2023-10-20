import { Router } from "express";
import controller from "../controladores/usuario.controller.js";

const router = Router();

/*
    Obtener usuario por id
*/
router.get("/:idUsuario", controller.getUsuarioById);
router.post("/", controller.createUsuario);

export default router;