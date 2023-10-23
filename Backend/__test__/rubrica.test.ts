import { Response } from 'superagent';
import request from 'supertest';

const app = 'http://localhost:3100';

let user: Response;

beforeAll( async () => {
  user = await request(app).post('/api/usuarios').send({
    "nombre": "Tomas",
    "correo": "tototototo@gmail.com",
    "contrasena": "passworD123"
  });
}, 15000);

describe("POST /api/usuarios/rubricas", () => {
  
  test("Crear nueva rubrica", async () => {
    
    const rubrica = await request(app).post('/api/usuarios/rubricas').send({
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

  test("Intentar crear rubrica con idUsuario invalido", async () => {
    const rubrica = await request(app).post('/api/usuarios/rubricas').send({
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
      usuarioId: "verdura"
    });
    expect(rubrica.statusCode).toBe(404);
  }, 15000);

  test("Intentar crear rubrica con usuario inexsitente", async () => {
    const rubrica = await request(app).post('/api/usuarios/rubricas').send({
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
      usuarioId: "333333333333333333333333"
    });
    expect(rubrica.statusCode).toBe(404);
  }, 15000);

  test("Intentar crear rubrica sin criterios", async () => {
    const rubrica = await request(app).post('/api/usuarios/rubricas').send({
      nombre:"Mi rubrica 123",
      criterios:[],
      niveles:[
        {nombre: "n1"},
        {nombre: "n2"},
        {nombre: "n3"},
      ],
      usuarioId: user.body.usuarioId
    });
    expect(rubrica.statusCode).toBe(400);
  }, 20000);

  test("Intentar crear rubrica sin niveles", async () => {
    const rubrica = await request(app).post('/api/usuarios/rubricas').send({
      nombre:"Mi rubrica 123",
      criterios:[
        {nombre: "c1",
         descripciones: ["d1", "d2", "d3"]},
      ],
      niveles:[],
      usuarioId: user.body.usuarioId
    });
    expect(rubrica.statusCode).toBe(400);
  }, 15000);

  test("Intentar crear una nueva rubrica con mas descripciones que niveles", async () => {
    
    const rubrica = await request(app).post('/api/usuarios/rubricas').send({
      nombre:"Mi rubrica 123",
      criterios:[
        {nombre: "c1",
         descripciones: ["d1", "d2", "d3","d4","d5"]},
         {nombre: "c2",
         descripciones: ["d4", "d5", "d6","d4"]},
      ],
      niveles:[
        {nombre: "n1"},
        {nombre: "n2"},
        {nombre: "n3"},
      ],
      usuarioId: user.body.id
    });
    expect(rubrica.statusCode).toBe(400);
  }, 15000);
});

describe("GET /usuarios/rubricas/:idRubrica", () => {
  let rubric: Response;

  beforeAll(async () => {
    rubric = await request(app).post('/api/usuarios/rubricas').send({
      nombre:"Rubrica 1",
      criterios:[
        {nombre: "c1",
         descripciones: ["dddd", "ddd2", "d3"]},
         {nombre: "c2",
         descripciones: ["d4", "d5ddd", "d6dddd"]},
      ],
      niveles:[
        {nombre: "n1aaaaa"},
        {nombre: "n2bbbbb"},
        {nombre: "n3ccccc"},
      ],
      usuarioId: user.body.id
    });
  });

  test("Obtener rubrica valida", async () => {
    const res = await request(app).get('/api/usuarios/rubricas/'+rubric.body.id);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(rubric.body);
  }, 15000);

  test("Intentar obtener una rubrica inexistente", async () => {
    const fakeid = "333333333333333333333333";
    const res = await request(app).get('/api/usuarios/rubricas/'+fakeid);

    expect(res.statusCode).toBe(404);
  }, 15000);

  test("Intentar obtener una rubrica con id invalido", async () => {
    const res = await request(app).get('/api/usuarios/rubricas/'+'idInvalido');

    expect(res.statusCode).toBe(404);
  }, 15000);

});