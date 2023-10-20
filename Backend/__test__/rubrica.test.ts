import request from 'supertest';

const app = 'http://localhost:3100';

describe("POST /api/rubricas", () => {
  test("Crear nueva rubrica", async () => {
    const user = await request(app).post('/api/usuarios').send({
      "nombre": "Tomas",
      "apellido": "aaaaaaa",
      "correo": "tototototo@gmail.com",
      "contrasena": "passworD123"
    });

    const rubrica = await request(app).post('/api/rubricas').send({
      nombre:"Mi rubrica 123",
      criterios:[
        {nombre: "c1",
         descripciones: ["d1", "d2", "d3"]},
         {nombre: "c2",
         descripciones: ["d4", "d5", "d6"]},
      ],
      niveles:[
        {nombre: "n1"},
        {nombre: "n2"},
        {nombre: "n3"},
      ],
      usuarioId: user.body.id
    });
    expect(rubrica.statusCode).toBe(201);
    expect(rubrica.body.nombre).toBe("Mi rubrica 123");
  }, 15000);
});