import request from 'supertest';

const app = 'http://localhost:3100';

describe("POST /api/usuarios", () => {
  it("should create an usuario", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
      "apellido": "Slab",
      "correo": "mimail@gmail.com",
      "contrasena": "passworD123"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("Tomas");
  })
});