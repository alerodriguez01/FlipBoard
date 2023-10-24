import request, { Response } from 'supertest';

const app = 'http://localhost:3100';

describe("POST /api/usuarios", () => {
  test("Crear nuevo usuario", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "tomas",
      "correo": "mimail@gmail.com",
      "contrasena": "passworD123"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("tomas");
  }, 15000);

  test("Intentar crear usuario con mail duplicado", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
      "correo": "mimail@gmail.com",
      "contrasena": "contrasenia331AA"
    });
    expect(res.statusCode).toBe(400);
  }, 10000);

  test("Intentar crear usuario con contrasena invalida", async () => {
    const res = await request(app).post("/api/usuarios").send({
      "nombre": "Tomas",
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

describe("PUT /cursos/:idCurso/alumnos", () => {
  let user1: Response;
  let user2: Response;
  let curso: Response;

  beforeAll( async () => {
    user1 = await request(app).post('/api/usuarios').send({
      "nombre": "Esteban quito",
      "correo": "mail1234321@gmail.com",
      "contrasena": "passworD123"
    });
    user2 = await request(app).post('/api/usuarios').send({
      "nombre": "Jero Jeronimo",
      "correo": "otromail6666@gmail.com",
      "contrasena": "passworD123"
    });
    curso = await request(app).post('/api/cursos').send({
      nombre: "curso esteban",
      emailContacto: "unmaildelcurso31@gmail.com",
      docentes: [user1.body.id],
    });
  }, 15000);

  test("Agregar usuario a un curso", async () => {
    const res = await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: user2.body.id,
    });
    curso = await request(app).get('/api/cursos/'+curso.body.id);
    user2 = await request(app).get('/api/usuarios/'+user2.body.id);

    expect(res.statusCode).toBe(204);
    expect(curso.body.participantes).toContain(user2.body.id);
    expect(user2.body.cursosAlumno).toContain(curso.body.id);
  }, 15000);

  test("Intentar agregar un usuario a un curso al que ya pertenece", async () => {
    const cursoViejo = {...curso.body};
    const res = await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: user1.body.id,
    });
    expect(res.statusCode).toBe(204);
    expect(curso.body.participantes).toStrictEqual(cursoViejo.participantes);
  }, 15000);

  test("Intentar agregar un usuario inexistente a un curso", async () => {
    const res = await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: "333333333333333333333333",
    });
    expect(res.statusCode).toBe(404);
  }, 15000);

  test("Intentar agregar un usuario a un curso inexistente", async () => {
    const res = await request(app).put('/api/cursos/333333333333333333333333/alumnos').send({
      id: user1.body.id,
    });
    expect(res.statusCode).toBe(404);
  }, 15000);

  test("Intentar utilizar la llamada sin enviar id de usuario", async () => {
    const res = await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({});
    expect(res.statusCode).toBe(400);
  }, 15000);
});