import exp from "constants";
import { Router } from "express";

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



export default router;