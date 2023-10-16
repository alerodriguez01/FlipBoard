import { router as loadInitialData } from "../database/prisma/load_initial_data.js";
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Hola Mundo!");
});


// Cargar datos iniciales en la base de datos
// GET
app.use('/cargar-datos', loadInitialData); 

const port = 3100;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});