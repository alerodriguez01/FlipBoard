import { router as loadInitialData } from "../database/prisma/load_initial_data.js";
import express from "express";
import logger from "morgan";
import cursoRouter from "./rutas/curso.route.js";
import rubricaRouter from "./rutas/rubrica.route.js";
import muralRouter from "./rutas/mural.route.js";
import usuarioRouter from "./rutas/usuario.route.js";
import authRouter from "./rutas/auth.route.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app = express();

// Middlewares
app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

// Swagger documentacion
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Flipboard API",
            version: "1.0.0",
            description: "API de Flipboard",
        }
    },
    apis: ["./src/rutas/*.ts"]
}
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)))


// Rutas
app.get("/api", (req, res) => {
    res.status(200).send("<h1>Flipboard API!</h1>");
});

app.use("/api/cursos", cursoRouter);
app.use("/api/rubricas", rubricaRouter);
app.use("/api/murales", muralRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/auth", authRouter)


// Cargar datos iniciales en la base de datos
// GET
app.use('/cargar-datos', loadInitialData);

const port = 3100;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

export default app;