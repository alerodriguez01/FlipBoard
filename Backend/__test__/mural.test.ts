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