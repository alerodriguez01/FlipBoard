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
}, 25000);

describe("POST /api/usuarios/:idUsuario/rubricas", () => {
  
  test("Crear nueva rubrica", async () => {
    
    const rubrica = await request(app).post(`/api/usuarios/${user.body.id}/rubricas`).send({
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
      ]
    });
    expect(rubrica.statusCode).toBe(201);
    expect(rubrica.body.nombre).toBe("Mi rubrica 123");
  }, 15000);

  test("Intentar crear rubrica con idUsuario invalido", async () => {
    const rubrica = await request(app).post('/api/usuarios/verdura/rubricas').send({
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
      ]
    });
    expect(rubrica.statusCode).toBe(400);
  }, 15000);

  test("Intentar crear rubrica con usuario inexsitente", async () => {
    const rubrica = await request(app).post('/api/usuarios/333333333333333333333333/rubricas').send({
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
      ]
    });
    expect(rubrica.statusCode).toBe(404);
  }, 15000);

  test("Intentar crear rubrica sin criterios", async () => {
    const rubrica = await request(app).post(`/api/usuarios/${user.body.id}/rubricas`).send({
      nombre:"Mi rubrica 123",
      criterios:[],
      niveles:[
        {nombre: "n1"},
        {nombre: "n2"},
        {nombre: "n3"},
      ]
    });
    expect(rubrica.statusCode).toBe(400);
  }, 20000);

  test("Intentar crear rubrica sin niveles", async () => {
    const rubrica = await request(app).post(`/api/usuarios/${user.body.id}/rubricas`).send({
      nombre:"Mi rubrica 123",
      criterios:[
        {nombre: "c1",
         descripciones: ["d1", "d2", "d3"]},
      ],
      niveles:[]
    });
    expect(rubrica.statusCode).toBe(400);
  }, 15000);

  test("Intentar crear una nueva rubrica con mas descripciones que niveles", async () => {
    
    const rubrica = await request(app).post(`/api/usuarios/${user.body.id}/rubricas`).send({
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
      ]
    });
    expect(rubrica.statusCode).toBe(400);
  }, 15000);
});

describe("GET /usuarios/rubricas/:idRubrica", () => {
  let rubric: Response;

  beforeAll(async () => {
    rubric = await request(app).post(`/api/usuarios/${user.body.id}/rubricas`).send({
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
      ]
    });
  }, 25000);

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

    expect(res.statusCode).toBe(400);
  }, 15000);

});

describe("GET /usuarios/:idUsuario/rubricas", () => {

  let usuario: Response;
  let r1: Response;
  let r2: Response;

  beforeAll( async () => {
    usuario = await request(app).post('/api/usuarios').send({
      "nombre": "Esteban Quito",
      "correo": "estebanquito@gmail.com",
      "contrasena": "contraseniAA11"
    });
    r1 = await request(app).post(`/api/usuarios/${usuario.body.id}/rubricas`).send({
      nombre:"Rubrica esteban 1",
      criterios:[
        {nombre: "c1",
         descripciones: ["d1", "d2"]},
      ],
      niveles:[
        {nombre: "n1"},
        {nombre: "n2"},
      ]
    });
    r2 = await request(app).post(`/api/usuarios/${usuario.body.id}/rubricas`).send({
      nombre:"Rubrica esteban 2",
      criterios:[
        {nombre: "mi lindo criterio",
         descripciones: ["d1", "desc"]},
      ],
      niveles:[
        {nombre: "n1"},
        {nombre: "nivel2"},
      ]
    });

  },25000);

  test("Obtener todas las rubricas de un usuario existente", async () => {
    const res = await request(app).get(`/api/usuarios/${usuario.body.id}/rubricas`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body).toContainEqual(r1.body);
    expect(res.body).toContainEqual(r2.body);
  }, 15000);

  test("Intentar obtener todas las rubricas de un usuario inexistente", async () => {
    const res = await request(app).get(`/api/usuarios/333333333333333333333333/rubricas`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  }, 15000);

  test("Intentar obtener todas las rubricas de un usuario con id invalido", async () => {
    const res = await request(app).get(`/api/usuarios/estoNoEsValido/rubricas`);

    expect(res.statusCode).toBe(400);
  }, 15000);

  
});

describe("PUT /cursos/:idCurso/rubricas", () => {

  let docente: Response;
  let curso: Response;
  let rubrica: Response;
  let alumno1: Response;
  let alumno2: Response;
  let alumno3: Response;

  beforeAll(async () => {
    docente = await request(app).post('/api/usuarios').send({
      "nombre": "don docente",
      "correo": "dondocente@gmail.com",
      "contrasena": "passworD123"
    });
    alumno1 = await request(app).post("/api/usuarios").send({
      "nombre": "don alumno1",
      "correo": "donalumno1@gmail.com",
      "contrasena": "passworD123"
    });
    alumno2 = await request(app).post("/api/usuarios").send({
      "nombre": "don alumno2",
      "correo": "donalumno2@gmail.com",
      "contrasena": "passworD123"
    });
    alumno3 = await request(app).post("/api/usuarios").send({
      "nombre": "don alumno3",
      "correo": "donalumno3@gmail.com",
      "contrasena": "passworD123"
    });
    rubrica = await request(app).post(`/api/usuarios/${docente.body.id}/rubricas`).send({
      nombre:"La rubrica del docenteeeee",
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
      ]
    });
    curso = await request(app).post('/api/cursos').send({
      nombre: "el curso de don docente",
      emailContacto: "contacto@gmail.com",
      docentes: [docente.body.id],
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno1.body.id,
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno2.body.id,
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno3.body.id,
    });
  }, 30000);

  describe("PUT /cursos/:idCurso/rubricas/alumnos", () => {

    test("Asignar rubrica a todos los participantes de un curso", async () => {
      const res = await request(app).put(`/api/cursos/${curso.body.id}/rubricas/alumnos`).send({
        idRubrica: rubrica.body.id
      });

      const cursoActualizado = await request(app).get(`/api/cursos/${curso.body.id}`);
      const rubricaActualizada = await request(app).get(`/api/usuarios/rubricas/${rubrica.body.id}`)

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
      expect(cursoActualizado.body.rubricasAlumnos).toContain(rubrica.body.id);
      expect(rubricaActualizada.body.alumnosCursos).toContain(curso.body.id);
    }, 15000);

    test("Intentar asignar rubrica inexistente a todos los participantes de un curso", async () => {
      const res = await request(app).put(`/api/cursos/${curso.body.id}/rubricas/alumnos`).send({
        idRubrica: "333333333333333333333333"
      });

      expect(res.statusCode).toBe(404);
    }, 15000);

    test("Intentar asignar rubrica invalida a todos los participantes de un curso", async () => {
      const res = await request(app).put(`/api/cursos/${curso.body.id}/rubricas/alumnos`).send({
        idRubrica: "invalido"
      });

      expect(res.statusCode).toBe(400);
    }, 15000);

    test("Intentar asignar rubrica a todos los participantes de un curso inexistente", async () => {
      const res = await request(app).put(`/api/cursos/333333333333333333333333/rubricas/alumnos`).send({
        idRubrica: rubrica.body.id
      });

      expect(res.statusCode).toBe(404);
    }, 15000);

    test("Intentar asignar rubrica a todos los participantes de un curso invalido", async () => {
      const res = await request(app).put(`/api/cursos/invalidoooo/rubricas/alumnos`).send({
        idRubrica: rubrica.body.id
      });

      expect(res.statusCode).toBe(400);
    }, 15000);
  });

  describe("PUT /cursos/:idCurso/rubricas/alumnos", () => {
    let grupo1: Response;
    let grupo2: Response;

    beforeAll(async () => {
      grupo1 = await request(app).post(`/api/cursos/${curso.body.id}/grupos`).send({
        integrantes: [alumno1.body.id, alumno2.body.id],
      });
      grupo2 = await request(app).post(`/api/cursos/${curso.body.id}/grupos`).send({
        integrantes: [alumno2.body.id, alumno3.body.id],
      });
    });

    test("Asignar rubrica a todos los grupos de un curso", async () => {
      const res = await request(app).put(`/api/cursos/${curso.body.id}/rubricas/grupos`).send({
        idRubrica: rubrica.body.id
      });

      const cursoActualizado = await request(app).get(`/api/cursos/${curso.body.id}`);
      const rubricaActualizada = await request(app).get(`/api/usuarios/rubricas/${rubrica.body.id}`)

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
      expect(cursoActualizado.body.rubricasGrupos).toContain(rubrica.body.id);
      expect(rubricaActualizada.body.gruposCursos).toContain(curso.body.id);
    }, 15000);

    test("Intentar asignar rubrica inexistente a todos los grupos de un curso", async () => {
      const res = await request(app).put(`/api/cursos/${curso.body.id}/rubricas/grupos`).send({
        idRubrica: "333333333333333333333333"
      });

      expect(res.statusCode).toBe(404);
    }, 15000);

    test("Intentar asignar rubrica invalida a todos los participantes de un curso", async () => {
      const res = await request(app).put(`/api/cursos/${curso.body.id}/rubricas/grupos`).send({
        idRubrica: "invalido"
      });

      expect(res.statusCode).toBe(400);
    }, 15000);

    test("Intentar asignar rubrica a todos los participantes de un curso inexistente", async () => {
      const res = await request(app).put(`/api/cursos/333333333333333333333333/rubricas/grupos`).send({
        idRubrica: rubrica.body.id
      });

      expect(res.statusCode).toBe(404);
    }, 15000);

    test("Intentar asignar rubrica a todos los participantes de un curso invalido", async () => {
      const res = await request(app).put(`/api/cursos/invalidoooo/rubricas/grupos`).send({
        idRubrica: rubrica.body.id
      });

      expect(res.statusCode).toBe(400);
    }, 15000);
  });

});