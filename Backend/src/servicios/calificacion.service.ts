
import { Calificacion } from "@prisma/client";
import { CalificacionRepository } from "../persistencia/repositorios/calificacion.repo.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import { GrupoRepository } from "../persistencia/repositorios/grupo.repo.js";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";

const califcacionRepository = CalificacionRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();
const grupoRepository = GrupoRepository.getInstance();
const muralRepository = MuralRepository.getInstance();

async function getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) {

    const calificaciones = await califcacionRepository.getCalificacionesFromUser(idCurso, idUsuario, rubrica, limit, offset);
    return calificaciones;

}

/*
    Crear calificacion
*/
async function createCalificacion(calificacion: Calificacion) {
    
    const curso = await cursoRepository.getCursoById(calificacion.cursoId);
    if(!curso)
        throw new NotFoundError("Curso");
    
    // Verificar que quien califica sea docente en el curso
    if(!curso.docentes.includes(calificacion.docenteId))
        throw new NotFoundError("Docente en Curso");

    // Si se califica a un usuario, verificar que el usuario pertenezca al curso
    if(calificacion.usuarioId && !curso.participantes.includes(calificacion.usuarioId))
        throw new NotFoundError("Usuario en Curso");

    // Si se califica a un grupo, verificar que el grupo pertenezca al curso
    if(calificacion.grupoId){
        const grupo = await grupoRepository.getGrupoById(calificacion.grupoId);
        if(!grupo || grupo.cursoId !== calificacion.cursoId)
            throw new NotFoundError("Grupo en Curso");
    }

    // Si la calificacion tiene asociado un mural
    if(calificacion.muralId){
        const mural = await muralRepository.getMuralById(calificacion.muralId);

        // Verificar que el mural pertenezca al curso
        if(!mural || mural.cursoId !== calificacion.cursoId)
            throw new NotFoundError("Mural en Curso");

        // Verificar si la rubrica asociada al mural coincide con la rubrica de la calificacion
        if(mural.rubricaId !== calificacion.rubricaId)
            throw new InvalidValueError("Mural", "rubricaId");
    }
    
    // Verificacion adicional para chequear que
    // - la dimension de valores se corresponda con la cantidad de criterios de la rubrica
    // - cada valor este entre 0 y length de niveles de la rubrica
    const rubrica = await rubricaRepository.getRubricaById(calificacion.rubricaId);
    if (!rubrica) throw new NotFoundError("Rubrica");

    if ( calificacion.valores.length !== rubrica.criterios.length ||
         calificacion.valores.some((valor: number) => valor < 0 || valor >= rubrica.niveles.length) ) throw new InvalidValueError("Calificacion", "valores");


    const newCalificacion = await califcacionRepository.createCalificacion(calificacion);
    return newCalificacion;

}

/*
    Obtener las calificaciones de un curso (opcionalmente aquellas asociadas a una rubrica en particular)
*/
async function getCalificacionesFromCurso(idCurso: string, limit: number, offset: number, idRubrica?: string) {

    const calificaciones = await califcacionRepository.getCalificacionesFromCurso(idCurso, limit, offset, idRubrica);
    return calificaciones;

}

export default { getCalificacionesFromUser, createCalificacion, getCalificacionesFromCurso };