import { Curso, Usuario } from '@prisma/client';
import request from 'supertest';

const app = 'http://localhost:3100';

describe("GET /api/cursos/:idCurso/grupos", () => {

    let curso: Curso;
    let integrante: Usuario;
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
        integrante = int.body;
    }, 25000);

    test("1. Obtener todos los grupos de un curso", async () => {

        const res = await request(app).get(`/api/cursos/${curso.id}/grupos`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);
    }, 15000);

    test("2. Obtener todos los grupos de un curso inexistente", async () => {

        const res = await request(app).get(`/api/cursos/${curso.id}123/grupos`);

        expect(res.status).toBe(404);
    }, 15000);

    test("3. Obtener todos los grupos de un curso con un integrante: ?integrante=", async () => {

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);
        // del array integrantesModel, espero encontrar un integrante que se llame integrante.nombre
        expect(res.body[0].integrantesModel).toEqual(expect.arrayContaining([expect.objectContaining({ nombre: integrante.nombre })]));

    }, 15000);

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

    }, 15000);

    test("5. Obtener todos los grupos de un curso con un integrante: ?integrante= y offset correcto", async () => {

        const offset = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integrante=${integrante.nombre}&offset=${offset}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);

    },15000);

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

    }, 15000);

    test("7. Obtener todos los grupos de un curso con ?integrante= invalido y limite valido", async () => {

        const limit = 3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body.length).toBeLessThanOrEqual(limit);
        expect(res.body[0].cursoId).toBe(curso.id);

    }, 15000);

    test("8. Obtener todos los grupos de un curso con limite negativo", async () => {

        const limit = -3;

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);

    },15000);

    test("8. Obtener todos los grupos de un curso con limite con letra", async () => {

        const limit = "hola";

        // Obtener todos los grupos de un curso con un integrante de nombre integrante.nombre
        const res = await request(app).get(`/api/cursos/${curso.id}/grupos?integranteEE=${integrante.nombre}&limit=${limit}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].cursoId).toBe(curso.id);

    },15000);

});