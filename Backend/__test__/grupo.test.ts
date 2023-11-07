import { Curso, Grupo, Usuario } from '@prisma/client';
import request from 'supertest';

const app = 'http://localhost:3100';

let curso: Curso;
let integrante: Usuario;
let integrante2: Usuario;

beforeAll(async () => {

    const duenioCurso = await request(app).post('/api/usuarios').send({
        "nombre": "Tomas Peiretti",
        "correo": "tomaspeirettiiiii@gmail.com",
        "contrasena": "123456678Aa"
    });
    const res = await request(app).post('/api/cursos').send({
        nombre: "el curso de tomas",
        tema: "gimnasio",
        sitioWeb: "tomastometi.com",
        descripcion: "describo descripcion",
        emailContacto: "tomaspeirettiiiii@gmail.com",
        docentes: [duenioCurso.body.id],
    })
    curso = res.body;

    let int = await request(app).post('/api/usuarios').send({
        "nombre": "Senor Integrante",
        "correo": "integrante@gmail.com",
        "contrasena": "123456678Aa"
    });
    await request(app).put('/api/cursos/'+curso.id+'/alumnos');
    int = await request(app).get(`/api/usuarios/${int.body.id}`);
    const int2 = await request(app).get(`/api/usuarios/${duenioCurso.body.id}`);
    integrante = int.body;
    integrante2 = int2.body;
}, 30000);

describe("POST /cursos/:idCurso/grupos", () => {
    
    test("Crear nuevo grupo", async () => {
        const res = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id, integrante2.id],
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.cursoId).toBe(curso.id);
        expect(res.body.integrantes).toHaveLength(2);
        expect(res.body.integrantes).toContain(integrante.id);
        expect(res.body.integrantes).toContain(integrante2.id);
    }, 15000);

    test("Intentar crear nuevo grupo con menos de dos integrantes", async () => {
        const res = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id],
        });

        expect(res.statusCode).toBe(400);
    }, 15000);

    test("Intentar crear nuevo grupo con un integrante inexistente", async () => {
        const res = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id, "333333333333333333333333"],
        });

        expect(res.statusCode).toBe(400);
    }, 15000);

    test("Intentar crear nuevo grupo con un integrante invalido", async () => {
        const res = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id, "estoEsInvalido"],
        });

        expect(res.statusCode).toBe(400);
    }, 15000);

    test("Intentar crear nuevo grupo con integrantes duplicados", async () => {
        const res = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id, integrante.id],
        });

        expect(res.statusCode).toBe(400);
    }, 15000);

    test("Intentar crear nuevo grupo en un curso inexistente", async () => {
        const res = await request(app).post(`/api/cursos/verdura/grupos`).send({
            integrantes: [integrante.id, integrante2.id],
        });

        expect(res.statusCode).toBe(400);
    }, 15000);
});

describe("GET /api/cursos/:idCurso/grupos", () => {

    let grupo1: Grupo;
    let grupo2: Grupo;

    beforeAll(async () => {
        const g1 = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id, integrante2.id],
        });
        const g2 = await request(app).post(`/api/cursos/${curso.id}/grupos`).send({
            integrantes: [integrante.id, integrante2.id],
        });

        grupo1 = g1.body;
        grupo2 = g2.body;

    },30000);

    test("1. Obtener todos los grupos de un curso", async () => {

        const res = await request(app).get(`/api/cursos/${curso.id}/grupos`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThanOrEqual(2);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);
        expect(res.body.grupos[1].cursoId).toBe(curso.id);
    }, 15000);

    test("2. Obtener todos los grupos de un curso con id invalido", async () => {

        const res = await request(app).get(`/api/cursos/${curso.id}123/grupos`);

        expect(res.status).toBe(400);
    }, 15000);

    test("3. Obtener todos los grupos de un curso con un integrante: ?integrante=", async () => {

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThanOrEqual(2);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);
        expect(res.body.grupos[1].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body.grupos[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));
        expect(res.body.grupos[1].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    }, 15000);

    test("4. Obtener todos los grupos de un curso con un integrante: ?integrante= y limit correcto", async () => {

        const limit = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThan(0);
        expect(res.body.grupos.length).toBeLessThanOrEqual(limit);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);
        expect(res.body.grupos[1].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body.grupos[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));
        expect(res.body.grupos[1].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    }, 15000);

    test("5. Obtener todos los grupos de un curso con un integrante: ?integrante= y offset correcto", async () => {

        const offset = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&offset=${offset}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos).toHaveLength(0);

    },15000);

    test("6. Obtener todos los grupos de un curso con un integrante: ?integrante= , offset y limit correctos", async () => {

        const limit = 3;
        const offset = 0;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&limit=${limit}&offset=${offset}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThan(0);
        expect(res.body.grupos.length).toBeLessThanOrEqual(limit);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body.grupos[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    }, 15000);

    test("7. Obtener todos los grupos de un curso con ?integrante= invalido y limite valido", async () => {

        const limit = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThan(0);
        expect(res.body.grupos.length).toBeLessThanOrEqual(limit);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);

    }, 15000);

    test("8. Obtener todos los grupos de un curso con limite negativo", async () => {

        const limit = -3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThan(0);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);

    },15000);

    test("8. Obtener todos los grupos de un curso con limite con letra", async () => {

        const limit = "hola";

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body.grupos).toBeInstanceOf(Array);
        expect(res.body.grupos.length).toBeGreaterThan(0);
        expect(res.body.grupos[0].cursoId).toBe(curso.id);

    },15000);

});