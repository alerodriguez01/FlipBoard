import { Curso, Usuario } from '@prisma/client';
import exp from 'constants';
import request from 'supertest';

const app = 'http://localhost:3100';

describe("GET /api/cursos/:idCurso/grupos", () => {

    // Busco un curso que exista
    let curso: Curso;
    let integrante: Usuario
    beforeAll(async () => {
        const res = await request(app).get('/api/cursos');
        curso = res.body[0];

        // Busco un integrante del curso por id
        const integranteRes = await request(app).get(`/api/usuarios/${curso.participantes[0]}`)
        integrante = integranteRes.body;
    });

    test("1. Obtener todos los grupos de un curso", async () => {

        const res = await request(app).get(`/api/cursos/${curso.id}/grupos`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);
    })

    test("2. Obtener todos los grupos de un curso inexistente", async () => {

        const res = await request(app).get(`/api/cursos/${curso.id}123/grupos`);

        expect(res.status).toBe(404);
    })

    test("3. Obtener todos los grupos de un curso con un integrante: ?integrante=", async () => {

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    })

    test("4. Obtener todos los grupos de un curso con un integrante: ?integrante= y limit correcto", async () => {

        const limit = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body.length).toBeLessThanOrEqual(limit);
        expect(res.body[0].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    })

    test("5. Obtener todos los grupos de un curso con un integrante: ?integrante= y offset correcto", async () => {

        const offset = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&offset=${offset}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);

    })

    test("6. Obtener todos los grupos de un curso con un integrante: ?integrante= , offset y limit correctos", async () => {

        const limit = 3;
        const offset = 0;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&limit=${limit}&offset=${offset}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body.length).toBeLessThanOrEqual(limit);
        expect(res.body[0].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    })

    test("7. Obtener todos los grupos de un curso con ?integrante= invalido y limite valido", async () => {

        const limit = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body.length).toBeLessThanOrEqual(limit);
        expect(res.body[0].cursoId).toBe(curso.id);

    })

    test("8. Obtener todos los grupos de un curso con limite negativo", async () => {

        const limit = -3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);

    })

    test("8. Obtener todos los grupos de un curso con limite con letra", async () => {

        const limit = "hola";

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);

    })

})