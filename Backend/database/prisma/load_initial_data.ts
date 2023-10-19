import express from "express";
import PrismaSingleton from "../../src/persistencia/prisma/dao/dbmanager.js";
import bcryptjs from 'bcryptjs';

// Router from express
export const router = express.Router();

const prisma = PrismaSingleton.getInstance();

router.get("/", async (req, res) => {
  try {
      await load_initial_data();
      res.status(200).send("Datos cargados");
  } catch (error) {
      res.status(400).send(`Error al cargar datos: ${error}`);
  }
});

async function load_initial_data() {

  // crear y guardar salt de ejemplo
  const salt1 = await bcryptjs.genSalt();
  const salt2 = await bcryptjs.genSalt();

  // Crear usuarios de ejemplo
  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      contrasena: await bcryptjs.hash('secreta123',salt1),
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'Maria',
      apellido: 'Gómez',
      correo: 'maria@example.com',
      contrasena: await bcryptjs.hash('clave123',salt2),
    },
  });

  //guardar salts
  await prisma.salt.create({
    data: {
      salt: salt1,
      usuarioId: usuario1.id
    }
  });

  await prisma.salt.create({
    data: {
      salt: salt2,
      usuarioId: usuario2.id
    }
  });

  // Crear cursos de ejemplo
  const curso1 = await prisma.curso.create({
    data: {
      nombre: 'Curso de Matemáticas',
      tema: 'Matemáticas Avanzadas',
      sitioWeb: 'https://matematicas.com',
      descripcion: 'Un curso de matemáticas avanzadas',
      emailContacto: 'contacto@matematicas.com',
    },
  });

  const curso2 = await prisma.curso.create({
    data: {
      nombre: 'Curso de Historia',
      tema: 'Historia del Mundo',
      sitioWeb: 'https://historia.com',
      descripcion: 'Un curso de historia global',
      emailContacto: 'contacto@historia.com',
    },
  });

  // Asociar usuarios a cursos
  await prisma.usuario.update({
    where: { id: usuario1.id },
    data: {
      cursosAlumnoModel: {
        // cuando hay que asociar una lista de objetos, se usa el nombre del campo con 'x' en el schema.prisma
        // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#connect
        // si hay que asociar solo un id, se coloca el campoId: id
        connect: [{ id: curso1.id }, { id: curso2.id }] // esto agregaría los cursos 1 y 2 al usuario 1 (NO REEMPLAZA)
      },
      cursosDocenteModel: {
        connect: [{ id: curso1.id }]
      },
    },
  });

  await prisma.usuario.update({
    where: { id: usuario2.id },
    data: {
      cursosAlumnoModel: {
        connect: [{ id: curso2.id }]
      },
    },
  });

  // Crear rubricas de ejemplo
  const rubrica1 = await prisma.rubrica.create({
    data: {
      nombre: 'Rubrica de Matemáticas',
      criterios: [
        { nombre: 'Precisión', descripciones: ['Muy preciso', 'Preciso', 'Poco preciso'] },
        { nombre: 'Complejidad', descripciones: ['Muy complejo', 'Complejo', 'Poco complejo'] },
      ],
      niveles: [
        { nombre: 'Nivel 1', puntaje: 1 },
        { nombre: 'Nivel 2', puntaje: 2 },
        { nombre: 'Nivel 3', puntaje: 3 },
      ],
      gruposModel: {
        connect: [{ id: curso1.id }]
      },
      alumnosModel: {
        connect: [{ id: curso1.id }]
      },
      usuarioId: usuario1.id,
    },
  });

  const rubrica2 = await prisma.rubrica.create({
    data: {
      nombre: 'Rubrica de Historia',
      criterios: [
        { nombre: 'Precisión', descripciones: ['Muy preciso', 'Preciso', 'Poco preciso'] },
        { nombre: 'Completitud', descripciones: ['Muy completo', 'Completo', 'Poco completo'] },
      ],

      niveles: [
        { nombre: 'Nivel A', puntaje: 4 },
        { nombre: 'Nivel B', puntaje: 3 },
        { nombre: 'Nivel C', puntaje: 2 },
      ],
      gruposModel: {
        connect: [{ id: curso2.id }]
      },
      alumnosModel: {
        connect: [{ id: curso2.id }]
      },
      usuarioId: usuario2.id,
    },
  });

  // Crear grupos de ejemplo
  const grupo1 = await prisma.grupo.create({
    data: {
      numero: 1,
      curso: {
        connect: { id: curso1.id },
      },
      integrantesModel: {
        connect: [{ id: usuario1.id }, { id: usuario2.id }],
      },
    },
  });

  const grupo2 = await prisma.grupo.create({
    data: {
      numero: 2,
      curso: {
        connect: { id: curso2.id },
      },
      integrantesModel: {
        connect: [{ id: usuario1.id }],
      },
    },
  });


  // Crear murales de ejemplo
  const mural1 = await prisma.mural.create({
    data: {
      nombre: 'Mural de Matemáticas',
      contenido: 'Contenido del mural de matemáticas',
      descripcion: 'Mural de matemáticas para el curso',
      rubricaId: rubrica1.id,
      cursoId: curso1.id,
    },
  });

  const mural2 = await prisma.mural.create({
    data: {
      nombre: 'Mural de Historia',
      contenido: 'Contenido del mural de historia',
      descripcion: 'Mural de historia para el curso',
      rubricaId: rubrica2.id,
      cursoId: curso2.id,
    },
  });

  // Crear calificaciones de ejemplo
  const calificacion1 = await prisma.calificacion.create({
    data: {
      valores: [3, 4],
      observaciones: 'Buen trabajo',
      rubricaId: rubrica1.id,
      usuarioId: usuario1.id,
      cursoId: curso1.id,
      muralId: mural1.id
    },
  });

  const calificacion2 = await prisma.calificacion.create({
    data: {
      valores: [3, 4],
      observaciones: 'Puede mejorar',
      rubricaId: rubrica2.id,
      grupoId: grupo2.id,
      cursoId: curso2.id,
      muralId: mural2.id
    },
  });
}


