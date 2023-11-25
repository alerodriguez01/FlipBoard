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
  const salt3 = await bcryptjs.genSalt();

  // Crear usuarios de ejemplo
  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'Tomas Peiretti'.toLowerCase(),
      correo: 'tomaspeiretti@gmail.com',
      contrasena: await bcryptjs.hash('123456789A', salt1),
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'Alejandro Rodriguez'.toLowerCase(),
      correo: 'rodriguezalejandro.anr@gmail.com',
      contrasena: await bcryptjs.hash('Contra123456', salt2),
    },
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      nombre: 'Pablo'.toLowerCase(),
      correo: 'pablo@example.com',
      contrasena: await bcryptjs.hash('Contra123456', salt3),
    },
  });

  //guardar salts
  await prisma.salt.create({
    data: {
      salt: salt1,
      userModel: { connect: { id: usuario1.id } }
    }
  });

  await prisma.salt.create({
    data: {
      salt: salt2,
      userModel: { connect: { id: usuario2.id } }
    }
  });

  await prisma.salt.create({
    data: {
      salt: salt3,
      userModel: { connect: { id: usuario3.id } }
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

  const curso3 = await prisma.curso.create({
    data: {
      nombre: 'Curso de Filosofia',
      tema: 'Un poco de filosofia',
      sitioWeb: 'https://filosofia.com',
      descripcion: 'Un curso de filosofia',
      emailContacto: 'contacto@filosofia.com',
    },
  });

  // Asociar usuarios a cursos
  await prisma.usuario.update({
    where: { id: usuario1.id },
    data: {
      cursosAlumnoModel: {
        // cuando hay que asociar un atributo que se correspone con otra relacion, se usa el nombre del campo con 'x' en el schema.prisma
        // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#connect
        connect: [{ id: curso1.id }, { id: curso2.id }] // esto agregaría los cursos 1 y 2 al usuario 1 (NO REEMPLAZA)
      },
      cursosDocenteModel: {
        connect: [{ id: curso3.id }]
      },
    },
  });

  await prisma.usuario.update({
    where: { id: usuario2.id },
    data: {
      cursosAlumnoModel: {
        connect: [{ id: curso1.id }, { id: curso3.id }]
      },
      cursosDocenteModel: {
        connect: [{ id: curso2.id }]
      },
    },
  });

  await prisma.usuario.update({
    where: { id: usuario3.id },
    data: {
      cursosAlumnoModel: {
        connect: [{ id: curso2.id }, { id: curso3.id }]
      },
      cursosDocenteModel: {
        connect: [{ id: curso1.id }]
      },
    },
  });

  // Crear rubricas de ejemplo
  const rubrica1 = await prisma.rubrica.create({
    data: {
      nombre: 'Ajuste y Tratamiento de datos',
      criterios: [
        { nombre: 'Utiliza estadística descriptiva para obtener parámetros numéricos', 
        descripciones: ['Aplica correctamente estadística descriptiva y obtiene todos los parámetros numéricos de interés.', 'Aplica correctamente estadística descriptiva y solo obtiene algunos parámetros numéricos de interés', 'Aplica parcialmenteestadística descriptiva y obtiene algunos parámetros numéricos pero no reconoce cuáles son los convenientes.', "Comete error al aplicar estadísitca descriptiva y no obtiene los parámetros numéricos."] },
        { nombre: 'Diseña el histograma defrecuencia e infiere a que distribución de probabilidad ajustaría', 
        descripciones: ['Identifica valor Mínimo y Máximo, selecciona el nro. adecuado de intervalos, agrupa correctamente las ocurrencias en cada intervalo en forma secuencial.', 'Identifica valor Mínimo y Máximo, selecciona erróneamente el nro. deintervalos, agrupa las ocurrencias según los intervalos que obtuvo.', 'Plantea un histograma que no está vinculado a los datos dados, reconoce valores mínimo y máximo y un nro. erróneo de intervalos', "No representa el histograma. Solo identifica valores mínimo y máximo."] },
        { nombre: 'Ajusta los datos a ladistrib. de probabilidad estándar o empírica utilizando una prueba de bondad de ajuste', 
        descripciones: ['Ajusta los datos aplicando correctamente una prueba de bondad de ajuste adecuada para la muestra de datos dada.', 'Ajusta los datos aplicando correctamente una prueba de bondad de ajuste adecuada para la muestra de datos dada PERO comete errores numéricos en la resolución', 'Ajusta los datos aplicando en forma errónea una prueba de bondad de ajuste para la muestra de datos dada', "Comete error al seleccionar y aplicar una prueba de bondad de ajuste para la muestra de datos dada."] },
      ],
      niveles: [
        { nombre: 'Excelente', puntaje: 10 },
        { nombre: 'Logrado', puntaje: 8 },
        { nombre: 'En proceso', puntaje: 6 },
        { nombre: 'No logrado', puntaje: 2 },
      ],
      gruposModel: {
        connect: [{ id: curso1.id }]
      },
      alumnosModel: {
        connect: [{ id: curso1.id }]
      },
      usuarioModel: { connect: { id: usuario1.id } }
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
      usuarioModel: { connect: { id: usuario2.id } }
    },
  });

  const rubrica3 = await prisma.rubrica.create({
    data: {
      nombre: 'Rubrica Test 1',
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
      usuarioModel: { connect: { id: usuario1.id } }
    },
  });

  const rubrica4 = await prisma.rubrica.create({
    data: {
      nombre: 'Rubrica Test 2',
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
      usuarioModel: { connect: { id: usuario1.id } }
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
        connect: [{ id: usuario1.id }, { id: usuario3.id }],
      },
    },
  });


  // Crear murales de ejemplo
  const mural1 = await prisma.mural.create({
    data: {
      nombre: 'Mural de Matemáticas',
      contenido: 'bd8275de19f09823351b,QRG5TUpqSLRf0uVTz6UeeA',
      descripcion: 'Mural de matemáticas para el curso',
      rubricaModel: { connect: { id: rubrica1.id, } },
      cursoModel: { connect: { id: curso1.id, } },
    },
  });

  const mural2 = await prisma.mural.create({
    data: {
      nombre: 'Mural de Historia',
      contenido: '272e3f8041a653b15259,RlYB8Z0stMspXIrCEgzESA',
      descripcion: 'Mural de historia para el curso',
      rubricaModel: { connect: { id: rubrica2.id, } },
      cursoModel: { connect: { id: curso2.id, } },
    },
  });

  // Crear calificaciones de ejemplo
  const calificacion1 = await prisma.calificacion.create({
    data: {
      valores: [3, 4],
      observaciones: 'Buen trabajo',
      rubricaModel: { connect: { id: rubrica1.id, } },
      usuarioModel: { connect: { id: usuario1.id } },
      cursoModel: { connect: { id: curso1.id, } },
      muralModel: { connect: { id: mural1.id } },
      docenteModel: { connect: { id: usuario3.id } },
      fecha: new Date()
    },
  });

  const calificacion2 = await prisma.calificacion.create({
    data: {
      valores: [3, 4],
      observaciones: 'Puede mejorar',
      rubricaModel: { connect: { id: rubrica2.id, } },
      usuarioModel: { connect: { id: usuario2.id } },
      cursoModel: { connect: { id: curso2.id, } },
      muralModel: { connect: { id: mural2.id } },
      docenteModel: { connect: { id: usuario2.id } },
      fecha: new Date()
    },
  });
}


export default load_initial_data;