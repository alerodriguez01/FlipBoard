import request, { Response } from 'supertest';

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

describe("GET /api/usuarios/:idUsuario", () => {
  let user: Response;
  let curso: Response;

  beforeAll( async () => {
    user = await request(app).post('/api/usuarios').send({
      "nombre": "Juan",
      "apellido": "Pepe",
      "correo": "testmail@gmail.com",
      "contrasena": "passworD123"
    });
    curso = await request(app).post('/api/cursos').send({
      nombre: "curso",
      tema: "temita",
      sitioWeb: "google.com",
      descripcion: "describo descripcion",
      emailContacto: "unmaildelcurso@gmail.com",
      docentes: [user.body.id],
    });
  }, 15000);

  test("Obtener usuario valido", async () => {
    const res = await request(app).get('/api/usuarios/'+user.body.id);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(user.body.id);
    expect(res.body.nombre).toBe(user.body.nombre);
  }, 10000);

  test("Intentar obtener usuario invalido", async () => {
    const res = await request(app).get('/api/usuarios/999');

    expect(res.statusCode).toBe(404);
  }, 10000);

  test("Intentar obtener usuario inexistente", async () => {
    const res = await request(app).get('/api/usuarios/333333333333333333333333');

    expect(res.statusCode).toBe(404);
  }, 10000);

  test("Obtener usuario valido con sus cursos asociados", async () => {
    const res = await request(app).get('/api/usuarios/'+user.body.id+'?cursos=true');

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(user.body.id);
    expect(res.body.cursosDocenteModel).toBeTruthy();
    expect(res.body.cursosAlumnoModel).toBeTruthy();
    expect(res.body.cursosDocente[0]).toBe(curso.body.id);
    expect(res.body.cursosDocenteModel[0]).toStrictEqual(curso.body);
  }, 15000);

  test("Obtener usuario valido con parametro de curso invalido", async () => {
    const res = await request(app).get('/api/usuarios/'+user.body.id+'?cursos=estoNoEsValido');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(user.body.id);
    expect(res.body.cursosDocente).toBeTruthy();
    expect(res.body.cursosDocente[0]).toBe(curso.body.id);
    expect(res.body.cursosDocenteModel).toBeFalsy();
    expect(res.body.cursosAlumnoModel).toBeFalsy();
  }, 15000);
});