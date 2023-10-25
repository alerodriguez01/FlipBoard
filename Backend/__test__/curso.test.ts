import request, { Response } from 'supertest';

const app = 'http://localhost:3100';

describe("POST /api/cursos", () => {
  
  let user: Response;
  beforeAll(async () => {
    user = await request(app).post('/api/usuarios').send({
      "nombre": "Pepe",
      "correo": "mmmmmmail@gmail.com",
      "contrasena": "123456678Aa"
    });
  }, 25000);

  test("Crear curso con todos los campos", async () => {
    const res = await request(app).post('/api/cursos').send({
      nombre: "curso1",
      tema: "temita",
      sitioWeb: "google.com",
      descripcion: "describo descripcion",
      emailContacto: "unmaildelcurso@gmail.com",
      docentes: [user.body.id],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("curso1");
    expect(res.body.docentes[0]).toBe(user.body.id);
  }, 10000);

  test("Crear curso solo con campos obligatorios", async () => {
    const res = await request(app).post('/api/cursos').send({
      nombre: "curso2",
      emailContacto: "unmaildelcurso@gmail.com",
      docentes: [user.body.id],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("curso2");
    expect(res.body.docentes[0]).toBe(user.body.id);
  }, 10000);

  test("Intentar crear curso con emailContacto invalido", async () => {
    const res = await request(app).post('/api/cursos').send({
      nombre: "curso3",
      emailContacto: "esto no es un mail",
      docentes: [user.body.id],
    });

    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear curso sin docente asociado", async () => {
    const res = await request(app).post('/api/cursos').send({
      nombre: "curso3",
      emailContacto: "unmaildelcurso@gmail.com"
    });

    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear curso sin nombre", async () => {
    const res = await request(app).post('/api/cursos').send({
      tema: "temita",
      sitioWeb: "google.com",
      descripcion: "describo descripcion",
      emailContacto: "unmaildelcurso@gmail.com",
      docentes: [user.body.id],
    });

    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear curso sin email de contacto", async () => {
    const res = await request(app).post('/api/cursos').send({
      nombre: "curso3",
      tema: "temita",
      sitioWeb: "google.com",
      descripcion: "describo descripcion",
      docentes: [user.body.id],
    });

    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear un curso con docente inexistente", async () => {
    const res = await request(app).post('/api/cursos').send({
      nombre: "curso1",
      tema: "temita",
      sitioWeb: "google.com",
      descripcion: "describo descripcion",
      emailContacto: "unmaildelcurso@gmail.com",
      docentes: ["333333333333333333333333"],
    });

    expect(res.statusCode).toBe(404);
  }, 10000);

});