import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Hola Mundo!");
});

const port = 3100;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});