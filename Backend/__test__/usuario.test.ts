import request from 'supertest';

const app = 'http://localhost:3100';

describe("POST /api/usuarios", () => {
  test("Crear nuevo usuario", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
      "apellido": "Slab",
      "correo": "mimail@gmail.com",
      "contrasena": "passworD123"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("Tomas");
  }, 10000);

  test("Intentar crear usuario con mail duplicado", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
      "apellido": "Peiretti",
      "correo": "mimail@gmail.com",
      "contrasena": "contrasenia331AA"
    });
    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear usuario con contrasena invalida", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
      "apellido": "Peiretti",
      "correo": "mailunico1312@gmail.com",
      "contrasena": "pass"
    });
    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear usuario con campos incompletos", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
      "correo": "mimail@gmail.com",
      "contrasena": "passworD321"
    });
    expect(res.statusCode).toBe(400);
  }, 10000);
});
