import request, { Response } from 'supertest';

const app = 'http://localhost:3100';

describe("POST /api/auth/login", () => {

    let userRes: Response;

    // Creo un usuario antes de ejecutar los tests
    const correo = "hola@gmail.com";
    const contrasena = "Ale123456";

    beforeAll(async () => {

        userRes = await request(app).post('/api/usuarios').send({
            "nombre": "Pepe",
            "correo": correo,
            "contrasena": contrasena
        });

    }, 15000);

    test("Login con usuario y contraseña correctos", async () => {

        const res = await request(app).post('/api/auth/login').send({
            correo: correo,
            contrasena: contrasena
        });

        expect(res.statusCode).toBe(200);
        // espero que la cookie 'token' exista
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.body.correo).toBe(correo);

    }, 15000);

    test("Login con correo incorrecto", async () => {

        const res = await request(app).post('/api/auth/login').send({
            correo: "correoInexistente@gmail.com",
            contrasena: contrasena
        });

        expect(res.statusCode).toBe(404);

    }, 15000);


    test("Login con contraseña incorrecta", async () => {

        const res = await request(app).post('/api/auth/login').send({
            correo: correo,
            contrasena: "contrasenaIncorrecta"
        });

        expect(res.statusCode).toBe(404);

    }, 15000);


    test("Login con campos faltantes", async () => {

        const res = await request(app).post('/api/auth/login').send({
            correo: correo,
            // contrasena: userRes.body.contrasena
        });

        expect(res.statusCode).toBe(400);

    }, 15000);

    test("Login con cookie no valida o expirada", async () => {

        const res = await request(app).post('/api/auth/login').set('Cookie', ['token=tokenInvalido']).send({
            correo: correo,
            contrasena: contrasena
        });

        expect(res.statusCode).toBe(401);

    }, 15000);

})