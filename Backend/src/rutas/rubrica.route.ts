import { Router } from "express";
import controller from "../controladores/rubrica.controller.js";

const router = Router();

/*
    Obtener rubrica por id
*/
router.get("/:idRubrica", controller.getRubricaById);
/**
 * Crear rubrica
 */
router.post("/", controller.createRubrica);

export default router;