import request, { Response } from 'supertest';

const app = 'http://localhost:3100';

describe("POST /cursos/:idCurso/calificaciones", () => {
  let alumno1: Response;
  let alumno2: Response;
  let docente: Response;
  let curso: Response;
  let grupo: Response;
  let rubrica: Response;
  
  beforeAll(async () => {
    alumno1 = await request(app).post("/api/usuarios").send({
      "nombre": "alumno1",
      "correo": "alumn1@gmail.com",
      "contrasena": "passworD123"
    });
    alumno2 = await request(app).post("/api/usuarios").send({
      "nombre": "alumno2",
      "correo": "alumn2@gmail.com",
      "contrasena": "passworD123"
    });
    docente = await request(app).post("/api/usuarios").send({
      "nombre": "el docente",
      "correo": "docente@gmail.com",
      "contrasena": "passworD123"
    });
    rubrica = await request(app).post(`/api/usuarios/${docente.body.id}/rubricas`).send({
      nombre:"La rubrica del docente",
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
      nombre: "cursotest",
      emailContacto: "cursotest@gmail.com",
      docentes: [docente.body.id],
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno1.body.id,
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno2.body.id,
    });
    grupo = await request(app).post(`/api/cursos/${curso.body.id}/grupos`).send({
      integrantes: [alumno1.body.id, alumno2.body.id],
  });
  }, 35000);  

  describe("POST /cursos/:idCurso/calificaciones/alumnos/:idUsuario", () => {
    
    test("Crear nueva calificacion para un alumno con observaciones", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}`).send({
        valores: [0, 1],
        observaciones: "bueN trabajo",
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.valores).toEqual([0,1]);
      expect(res.body.usuarioId).toBe(alumno1.body.id);
      expect(res.body.cursoId).toBe(curso.body.id);
      expect(res.body.observaciones).toBe("bueN trabajo");
      
    }, 15000);

    test("Crear nueva calificacion para un alumno sin observaciones", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [0, 2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.valores).toEqual([0,2]);
      expect(res.body.usuarioId).toBe(alumno2.body.id);
      expect(res.body.cursoId).toBe(curso.body.id);
      expect(res.body.observaciones).toBeFalsy();
      
    }, 15000);

    test("Intentar crear una calificacion para un alumno que no pertenece al curso", async () => {
      const user = await request(app).post("/api/usuarios").send({
        "nombre": "nosoy alumno",
        "correo": "nosoyalumno@gmail.com",
        "contrasena": "passworD123"
      });
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${user.body.id}`).send({
        valores: [2, 2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(404);

    }, 20000);

    test("Intentar crear una calificacion sin ser un docente del curso", async () => {
     
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [0, 0],
        idRubrica: rubrica.body.id,
        idDocente: alumno1.body.id
      });

      expect(res.statusCode).toBe(404);

    }, 20000);

    test("Intentar crear una calificacion con valores faltantes", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con valores demas", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2,2,2,2,2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con valores fuera de rango", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2,3],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion sin rubrica asociada", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2, 2],
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con rubrica inexistente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2, 2],
        idRubrica: "333333333333333333333333",
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(404);

    }, 15000);

    test("Intentar crear una calificacion con rubrica invalida", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2, 2],
        idRubrica: "noValido",
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion en un curso invalido", async () => {
      const res = await request(app).post(`/api/cursos/verdura/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2, 2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion sin idDocente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    
    test("Intentar crear una calificacion con idDocente invalido", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
        idDocente: "Invalid"
      });

      expect(res.statusCode).toBe(400); // se recibe 404 (no se encontro Docente en Curso) porque no se valida el idDocente, sino que se busca directamente si esta dentro de los cursos

    }, 15000);
    
    test("Intentar crear una calificacion con idDocente inexistente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
        idDocente: "333333333333333333333333"
      });

      expect(res.statusCode).toBe(404); // se recibe 404 (no se encontro Docente en Curso) porque no se valida el idDocente, sino que se busca directamente si esta dentro de los cursos

    }, 15000);
    

  });

  describe("POST /cursos/calificaciones/grupos/:idGrupo", () => {
    test("Crear nueva calificacion para un grupo con observaciones", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [0, 1],
        observaciones: "bueN trabajo",
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.valores).toEqual([0,1]);
      expect(res.body.grupoId).toBe(grupo.body.id);
      expect(res.body.cursoId).toBe(curso.body.id);
      expect(res.body.observaciones).toBe("bueN trabajo");
      
    }, 15000);

    test("Crear nueva calificacion para un grupo sin observaciones", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [0, 2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.valores).toEqual([0,2]);
      expect(res.body.grupoId).toBe(grupo.body.id);
      expect(res.body.cursoId).toBe(curso.body.id);
      expect(res.body.observaciones).toBeFalsy();
      
    }, 15000);

    test("Intentar crear una calificacion para un grupo que no pertenece al curso", async () => {
            const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/123456789123456789123456`).send({
        valores: [2, 2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(404);

    }, 20000);

    test("Intentar crear una calificacion sin ser un docente del curso", async () => {
     
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [0, 0],
        idRubrica: rubrica.body.id,
        idDocente: alumno1.body.id
      });

      expect(res.statusCode).toBe(404);

    }, 20000);

    test("Intentar crear una calificacion con valores faltantes", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con valores demas", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2,2,2,2,2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con valores fuera de rango", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2,3],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion sin rubrica asociada", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2, 2],
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con rubrica inexistente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2, 2],
        idRubrica: "333333333333333333333333",
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(404);

    }, 15000);

    test("Intentar crear una calificacion con rubrica invalida", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2, 2],
        idRubrica: "noValido",
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion en un curso invalido", async () => {
      const res = await request(app).post(`/api/cursos/verdura/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2, 2],
        idRubrica: rubrica.body.id,
        idDocente: docente.body.id
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion sin idDocente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

  });

});

describe("GET /cursos/:idCurso/calificaciones", () => {
  let alumno1: Response;
  let alumno2: Response;
  let docente: Response;
  let curso: Response;
  let grupo: Response;
  let rubrica1: Response;
  let rubrica2: Response;
  let calif1: Response;
  let calif2: Response;
  let calif3: Response;
  
  beforeAll(async () => {
    alumno1 = await request(app).post("/api/usuarios").send({
      "nombre": "alumnooo1",
      "correo": "alumnooo1@gmail.com",
      "contrasena": "passworD123"
    });
    alumno2 = await request(app).post("/api/usuarios").send({
      "nombre": "alumnooo2",
      "correo": "alumnooo2@gmail.com",
      "contrasena": "passworD123"
    });
    docente = await request(app).post("/api/usuarios").send({
      "nombre": "el docenteeee",
      "correo": "docenteeee@gmail.com",
      "contrasena": "passworD123"
    });
    rubrica1 = await request(app).post(`/api/usuarios/${docente.body.id}/rubricas`).send({
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
    rubrica2 = await request(app).post(`/api/usuarios/${docente.body.id}/rubricas`).send({
      nombre:"La otra rubrica del docenteeeee",
      criterios:[
        {nombre: "c1",
         descripciones: ["d1", "d2", "d3"]},
      ],
      niveles:[
        {nombre: "n1"},
        {nombre: "n2"},
        {nombre: "n3"},
      ]
    });
    curso = await request(app).post('/api/cursos').send({
      nombre: "otro curso jeje",
      emailContacto: "contacto@gmail.com",
      docentes: [docente.body.id],
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno1.body.id,
    });
    await request(app).put('/api/cursos/'+curso.body.id+'/alumnos').send({
      id: alumno2.body.id,
    });
    grupo = await request(app).post(`/api/cursos/${curso.body.id}/grupos`).send({
      integrantes: [alumno1.body.id, alumno2.body.id],
    });
    calif1 = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}`).send({
      valores: [0, 1],
      observaciones: "bueN trabajo",
      idRubrica: rubrica1.body.id,
      idDocente: docente.body.id
    });
    calif2 = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
      valores: [2, 2],
      idRubrica: rubrica1.body.id,
      idDocente: docente.body.id
    });
    calif3 = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
      valores: [1],
      idRubrica: rubrica2.body.id,
      idDocente: docente.body.id
    });
  }, 35000);

  test("Cargar todas las calificaciones de un curso", async () => {
    const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.result.length).toBe(3);

  }, 15000);

  test("Intentar cargar todas las calificaciones de un curso inexistente", async () => {
    const res = await request(app).get(`/api/cursos/333333333333333333333333/calificaciones`);

    expect(res.statusCode).toBe(200); 
    expect(res.body.result).toHaveLength(0);   
  }, 15000);

  test("Intentar cargar todas las calificaciones de un curso invalido", async () => {
    const res = await request(app).get(`/api/cursos/1234/calificaciones`);

    expect(res.statusCode).toBe(400);    
  }, 15000);

  test("Cargar todas las calificaciones de un curso de rubrica especifica", async () => {
    const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones?rubrica=${rubrica1.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result.length).toBe(2);

  }, 15000);

  test("Intentar cargar todas las calificaciones de un curso de rubrica inexistente", async () => {
    const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones?rubrica=333333333333333333333333`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toHaveLength(0);
  }, 15000);

  test("Intentar cargar todas las calificaciones de un curso de rubrica invalida", async () => {
    const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones?rubrica=invalid`);

    expect(res.statusCode).toBe(400);
  }, 15000);

  test("Cargar todas las calificaciones de un curso de rubrica especifica paginado", async () => {
    const limit = 1;
    const offset = 0;
    const res = await request(app)
        .get(`/api/cursos/${curso.body.id}/calificaciones?rubrica=${rubrica1.body.id}&limit=${limit}&offset=${offset}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result.length).toBe(1);
  }, 15000);

  test("Cargar todas las calificaciones de un curso de rubrica especifica paginado con offset invalido", async () => {
    const limit = 10;
    const offset = "a";
    const res = await request(app)
        .get(`/api/cursos/${curso.body.id}/calificaciones?rubrica=${rubrica1.body.id}&limit=${limit}&offset=${offset}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result.length).toBe(2);
  }, 15000);

  test("Cargar todas las calificaciones de un curso de rubrica especifica paginado con limit invalido", async () => {
    const limit = "invalid";
    const offset = 1
    const res = await request(app)
        .get(`/api/cursos/${curso.body.id}/calificaciones?rubrica=${rubrica1.body.id}&limit=${limit}&offset=${offset}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result.length).toBe(1);
  }, 15000);

  describe("GET /cursos/:idCurso/calificaciones/alumnos/:idUsuario", () => {
    let calif4: Response;

    beforeAll(async () => {
      calif4 = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}`).send({
        valores: [1],
        idRubrica: rubrica2.body.id,
        idDocente: docente.body.id
      });
    }, 15000);

    test("Cargar todas las calificaciones que le pertenecen a un alumno sin rubricas", async () => {
      const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveLength(3); // calif1, calif3 (grupo) y calif4
    }, 15000);

    test("Intentar cargar todas las calificaciones que le pertenecen a un alumno inexistente", async () => {
      const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones/alumnos/333333333333333333333333`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toEqual([]);
    }, 15000);

    test("Cargar todas las calificaciones que le pertenecen a un alumno con rubricas", async () => {
      const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}?rubrica=true`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveLength(3); // calif1, calif3 (grupo) y calif4
    }, 15000);

    test("Intentar cargar todas las calificaciones que le pertenecen a un alumno invalido", async () => {
      const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones/alumnos/123?rubrica=true`);

      expect(res.statusCode).toBe(400);
    }, 15000);

    test("Cargar todas las calificaciones que le pertenecen a un alumno sin rubricas paginado", async () => {
      const limit = 1;
      const offset = 1;
      const res = await request(app)
          .get(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}?offset=${offset}&limit=${limit}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveLength(1);
      expect(res.body.result[0].rubricaModel).toBeFalsy();
    }, 15000);

    test("Intentar cargar todas las calificaciones que le pertenecen a un alumno de un curso inexistente", async () => {
      const limit = 1;
      const offset = 1;
      const res = await request(app)
          .get(`/api/cursos/333333333333333333333333/calificaciones/alumnos/${alumno1.body.id}?offset=${offset}&limit=${limit}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toEqual([]);
    }, 15000);

    test("Cargar todas las calificaciones que le pertenecen a un alumno con rubricas paginado", async () => {
      const limit = 5;
      const offset = 2;
      const res = await request(app)
          .get(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno1.body.id}?rubrica=true&offset=${offset}&limit=${limit}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveLength(1);
      expect(res.body.result[0]).toHaveProperty("rubricaModel");
      expect(res.body.result[0].rubricaModel).toBeTruthy();
    }, 15000);

    test("Intentar cargar todas las calificaciones que le pertenecen a un alumno con rubricas paginado de un curso inexistente", async () => {
      const limit = 5;
      const offset = 2;
      const res = await request(app)
          .get(`/api/cursos/333333333333333333333333/calificaciones/alumnos/${alumno1.body.id}?rubrica=true&offset=${offset}&limit=${limit}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toEqual([]);
    }, 15000);
    
  });

  describe("GET /cursos/:idCurso/calificaciones/grupos", () => {
    test("Cargar todas las calificaciones asociadas a grupos de un curso", async () => {
      const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones/grupos`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.result.length).toBe(1);  
    }, 15000);

    test("Intentar cargar todas las calificaciones asociadas a grupos de un curso inexistente", async () => {
      const res = await request(app).get(`/api/cursos/333333333333333333333333/calificaciones/grupos`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toEqual([])  
    }, 15000);

    test("Intentar cargar todas las calificaciones asociadas a grupos de un curso invalido", async () => {
      const res = await request(app).get(`/api/cursos/invalid/calificaciones/grupos`);
      
      expect(res.statusCode).toBe(400);  
    }, 15000);
  });

  describe("GET /cursos/:idCurso/calificaciones/alumnos", () => {
    test("Cargar todas las calificaciones asociadas a alumnos de un curso", async () => {
      const res = await request(app).get(`/api/cursos/${curso.body.id}/calificaciones/alumnos`);
      
      expect(res.statusCode).toBe(200);
      // 3 por la calificacion que se crea en los otros tres
      expect(res.body.result.length).toBe(3);  
    }, 15000);

    test("Intentar cargar todas las calificaciones asociadas a alumnos de un curso inexistente", async () => {
      const res = await request(app).get(`/api/cursos/333333333333333333333333/calificaciones/alumnos`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toEqual([])  
    }, 15000);

    test("Intentar cargar todas las calificaciones asociadas a alumnos de un curso invalido", async () => {
      const res = await request(app).get(`/api/cursos/invalid/calificaciones/alumnos`);
      
      expect(res.statusCode).toBe(400);  
    }, 15000);
  });

});