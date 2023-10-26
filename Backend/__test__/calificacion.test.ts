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

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con idDocente inexistente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/alumnos/${alumno2.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
        idDocente: "333333333333333333333333"
      });

      expect(res.statusCode).toBe(400);

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

    test("Intentar crear una calificacion con idDocente invalido", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
        idDocente: "Invalid"
      });

      expect(res.statusCode).toBe(400);

    }, 15000);

    test("Intentar crear una calificacion con idDocente inexistente", async () => {
      const res = await request(app).post(`/api/cursos/${curso.body.id}/calificaciones/grupos/${grupo.body.id}`).send({
        valores: [2,2],
        idRubrica: rubrica.body.id,
        idDocente: "333333333333333333333333"
      });

      expect(res.statusCode).toBe(400);

    }, 15000);
  });

});