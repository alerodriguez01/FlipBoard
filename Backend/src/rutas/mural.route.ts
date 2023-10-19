import { Router } from "express";
import controller from "../controladores/mural.controller.js";

const router = Router();

router.get("/:idMural", controller.getMuralById);

export default router;