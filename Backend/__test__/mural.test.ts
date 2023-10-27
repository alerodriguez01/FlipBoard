import { Response } from 'superagent';
import request from 'supertest';

const app = 'http://localhost:3100';

let alumno: Response;
let docente: Response;
let rubrica: Response;
let curso: Response;

beforeAll(async () => {

    // Creo un alumno y un docente
    alumno = await request(app).post("/api/usuarios").send({
        "nombre": "alumno",
        "correo": "alumn1@gmail.com",
        "contrasena": "passworD123"
    });
    docente = await request(app).post("/api/usuarios").send({
        "nombre": "el docente",
        "correo": "docente@gmail.com",
        "contrasena": "passworD123"
    });

    // Creo un curso y le asigno el docente
    curso = await request(app).post('/api/cursos').send({
        nombre: "cursotest",
        emailContacto: "cursotest@gmail.com",
        docentes: [docente.body.id],
    });
    // Le agrego un participante
    await request(app).put('/api/cursos/' + curso.body.id + '/alumnos').send({
        id: alumno.body.id,
    });

    // Creo una rubrica para asignar a un mural
    rubrica = await request(app).post(`/api/usuarios/${docente.body.id}/rubricas`).send({
        nombre: "La rubrica del docente",
        criterios: [
            {
                nombre: "c1",
                descripciones: ["d1", "d2", "d3"]
            },
            {
                nombre: "c2",
                descripciones: ["d4", "d5", "d6"]
            },
        ],
        niveles: [
            { nombre: "n1" },
            { nombre: "n2" },
            { nombre: "n3" },
        ]
    });

}, 25000);

describe('POST /api/cursos/murales', () => {

    test('Crear un mural valido con rubrica asignada', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(201);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaId).toBe(rubrica.body.id);

    }, 15000);

    test('Crear un mural valido sin rubrica asignada', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(201);
        expect(res.body.cursoId).toBe(curso.body.id);

    }, 15000);

    test('Crear un mural sin nombre', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(400);

    }, 15000);

    test('Crear un mural sin contenido', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(400);

    }, 15000);

    test('Crear un mural sin descripcion', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(201);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaId).toBe(rubrica.body.id);

    }, 15000);

    test('Crear un mural sin docente', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id
        })

        expect(res.status).toBe(400);

    }, 15000);

    test('Crear un mural valido en un curso inexistente', async () => {

        const res = await request(app).post(`/api/cursos/333333333333333333333333/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(404);

    }, 15000);

    test('Crear un mural valido en un curso invalido', async () => {

        const res = await request(app).post(`/api/cursos/33/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

        expect(res.status).toBe(404); // porque antes se chequea que el docente pertenezca al curso. Si no pertenece, se devuelve 404

    }, 15000);

    test('Crear un mural valido con un docente inexistente', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: "333333333333333333333333",
        })

        expect(res.status).toBe(404);

    }, 15000);

    test('Crear un mural valido con un docente invalido', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: "33",
        })

        expect(res.status).toBe(400);

    }, 15000);

    test('Crear un mural valido en nombre de un alumno del curso', async () => {

        const res = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Matemáticas",
            contenido: "Contenido del mural de matemáticas",
            descripcion: "Mural de matemáticas para el curso",
            idRubrica: rubrica.body.id,
            idDocente: alumno.body.id,
        })

        expect(res.status).toBe(404);

    }, 15000);

})

describe("GET /api/cursos/murales/:idMural", () => {

    let mural: Response;

    beforeAll(async () => {

        // Crear un mural
        mural = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Historia",
            contenido: "Contenido del mural de Historia",
            descripcion: "Mural de historia para el curso",
            idRubrica: rubrica.body.id,
            idDocente: docente.body.id,
        })

    }, 15000);

    test('Obtener un mural valido', async () => {

        const res = await request(app).get(`/api/cursos/murales/${mural.body.id}`).send();

        expect(res.status).toBe(200);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaId).toBe(rubrica.body.id);

    }, 15000);

    test('Obtener un mural valido con su rubrica valido', async () => {

        const res = await request(app).get(`/api/cursos/murales/${mural.body.id}?rubrica=true`).send();

        expect(res.status).toBe(200);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaModel.id).toBe(rubrica.body.id);

    }, 15000);

    test('Obtener un mural valido con su rubrica invalido', async () => {

        const res = await request(app).get(`/api/cursos/murales/${mural.body.id}?rubrica=false`).send();

        expect(res.status).toBe(200);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaModel).toBeFalsy();

    }, 15000);

    test('Obtener un mural valido con su rubrica con un valor no boolean', async () => {

        const res = await request(app).get(`/api/cursos/murales/${mural.body.id}?rubrica=HOLA`).send();

        expect(res.status).toBe(200);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaModel).toBeFalsy();

    }, 15000);

    test('Obtener un mural valido con su rubrica como parametro mal pasada', async () => {

        const res = await request(app).get(`/api/cursos/murales/${mural.body.id}?rubriccca=HOLA`).send();

        expect(res.status).toBe(200);
        expect(res.body.cursoId).toBe(curso.body.id);
        expect(res.body.rubricaModel).toBeFalsy();

    }, 15000);

    test('Obtener un mural inexistente', async () => {

        const res = await request(app).get(`/api/cursos/murales/333333333333333333333333`).send();

        expect(res.status).toBe(404);

    }, 15000);

    test('Obtener un mural invalido', async () => {

        const res = await request(app).get(`/api/cursos/murales/33`).send();

        expect(res.status).toBe(400);

    }, 15000);

})

describe("GET /cursos/:idCurso/murales", () => {

    let mural1: Response;
    let mural2: Response;
    let rubrica2: Response;

    beforeAll(async () => {

        // Crear un mural
        mural1 = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Historia",
            contenido: "Contenido del mural de Historia",
            descripcion: "Mural de historia para el curso",
            idRubrica: rubrica.body.id, // rubrica creada globalmente
            idDocente: docente.body.id,
        })

        // Creo una rubrica para asignar a mural2
        rubrica2 = await request(app).post(`/api/usuarios/${docente.body.id}/rubricas`).send({
            nombre: "La rubrica para filosofia",
            criterios: [
                {
                    nombre: "c1",
                    descripciones: ["d1", "d2", "d3"]
                },
                {
                    nombre: "c2",
                    descripciones: ["d4", "d5", "d6"]
                },
            ],
            niveles: [
                { nombre: "n1" },
                { nombre: "n2" },
                { nombre: "n3" },
            ]
        });

        // Crear otro mural
        mural2 = await request(app).post(`/api/cursos/${curso.body.id}/murales`).send({
            nombre: "Mural de Filosofia",
            contenido: "Contenido del mural de Filosofia",
            descripcion: "Mural de Filosofia para el curso",
            idRubrica: rubrica2.body.id,
            idDocente: docente.body.id,
        })

    }, 15000);

    test('Obtener murales del curso', async () => {

        const res = await request(app).get(`/api/cursos/${curso.body.id}/murales`).send();

        expect(res.status).toBe(200);
        // que contenga los dos murales creados
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: mural1.body.id, rubricaId: rubrica.body.id }),
                expect.objectContaining({ id: mural2.body.id, rubricaId: rubrica2.body.id }),
            ])
        );

    }, 15000);

    test('Obtener murales del curso con su respectiva rubrica', async () => {

        const res = await request(app).get(`/api/cursos/${curso.body.id}/murales?rubrica=true`).send();

        expect(res.status).toBe(200);
        // que contenga los dos murales creados
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: mural1.body.id, rubricaId: rubrica.body.id, rubricaModel: expect.anything() }),
                expect.objectContaining({ id: mural2.body.id, rubricaId: rubrica2.body.id, rubricaModel: expect.anything() }),
            ])
        );

    }, 15000);

    test('Obtener murales del curso sin rubrica', async () => {

        const res = await request(app).get(`/api/cursos/${curso.body.id}/murales?rubrica=false`).send();

        expect(res.status).toBe(200);
        // que contenga los dos murales creados
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: mural1.body.id, rubricaId: rubrica.body.id }),
                expect.objectContaining({ id: mural2.body.id, rubricaId: rubrica2.body.id }),
            ])
        );
        // que no contenga las rubricas
        expect(res.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ rubricaModel: expect.anything() }),
                expect.objectContaining({ rubricaModel: expect.anything() }),
            ])
        );

    }, 15000);

    test('Obtener murales del curso con el parametro de rubrica no boolean', async () => {

        const res = await request(app).get(`/api/cursos/${curso.body.id}/murales?rubrica=HOLA`).send();

        expect(res.status).toBe(200);
        // que contenga los dos murales creados
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: mural1.body.id, rubricaId: rubrica.body.id }),
                expect.objectContaining({ id: mural2.body.id, rubricaId: rubrica2.body.id }),
            ])
        );
        // que no contenga las rubricas
        expect(res.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ rubricaModel: expect.anything() }),
                expect.objectContaining({ rubricaModel: expect.anything() }),
            ])
        );

    }, 15000);

    test('Obtener murales del curso con el parametro de rubrica invalido', async () => {

        const res = await request(app).get(`/api/cursos/${curso.body.id}/murales?rubricaAA=true`).send();

        expect(res.status).toBe(200);
        // que contenga los dos murales creados
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: mural1.body.id, rubricaId: rubrica.body.id }),
                expect.objectContaining({ id: mural2.body.id, rubricaId: rubrica2.body.id }),
            ])
        );
        // que no contenga las rubricas
        expect(res.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ rubricaModel: expect.anything() }),
                expect.objectContaining({ rubricaModel: expect.anything() }),
            ])
        );

    }, 15000);

    test('Obtener murales de un curso inexistente', async () => {

        const res = await request(app).get(`/api/cursos/333333333333333333333333/murales`).send();

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);

    }, 15000);

    test('Obtener murales de un curso invalido', async () => {

        const res = await request(app).get(`/api/cursos/33/murales`).send();

        expect(res.status).toBe(400);

    }, 15000);

})