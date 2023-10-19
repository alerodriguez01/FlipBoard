import { router as loadInitialData } from "../database/prisma/load_initial_data.js";
import express from "express";
import logger from "morgan";
import cursoRouter from "./rutas/curso.route.js";
import rubricaRouter from "./rutas/rubrica.route.js";

const app = express();

app.use(express.json());
app.use(logger('dev'))

app.get("/", (req, res) => {
    res.status(200).send("Hola Mundo!");
});

app.use("/api/cursos", cursoRouter);
app.use("/api/rubricas", rubricaRouter);


// Cargar datos iniciales en la base de datos
// GET
app.use('/cargar-datos', loadInitialData); 

const port = 3100;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});