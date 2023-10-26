
import { Calificacion } from "@prisma/client";
import { CalificacionRepository } from "../persistencia/repositorios/calificacion.repo.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";

const califcacionRepository = CalificacionRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();

async function getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) {

    const calificaciones = await califcacionRepository.getCalificacionesFromUser(idCurso, idUsuario, rubrica, limit, offset);
    return calificaciones;

}

/*
    Crear calificacion
*/
async function createCalificacion(calificacion: Calificacion) {

    // Verificacion adicional para chequear que
    // - la dimension de valores se corresponda con la cantidad de criterios de la rubrica
    // - cada valor este entre 0 y length de niveles de la rubrica
    const rubrica = await rubricaRepository.getRubricaById(calificacion.rubricaId);
    if (!rubrica) throw new NotFoundError("Rubrica");

    if ( calificacion.valores.length !== rubrica.criterios.length ||
         calificacion.valores.some((valor: number) => valor < 0 || valor > rubrica.niveles.length) ) throw new InvalidValueError("Calificacion", "valores");


    const newCalificacion = await califcacionRepository.createCalificacion(calificacion);
    return newCalificacion;

}

export default { getCalificacionesFromUser, createCalificacion };