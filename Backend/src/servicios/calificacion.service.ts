
import { Calificacion, Usuario } from "@prisma/client";
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
    if (!curso)
        throw new NotFoundError("Curso");

    if (calificacion.docenteId.length !== 24)
        throw new InvalidValueError("Calificacion", "docenteId");

    // Verificar que quien califica sea docente en el curso
    if (!curso.docentes.includes(calificacion.docenteId))
        throw new NotFoundError("Docente en Curso");

    // Si se califica a un usuario, verificar que el usuario pertenezca al curso
    if (calificacion.usuarioId && !curso.participantes.includes(calificacion.usuarioId))
        throw new NotFoundError("Usuario en Curso");

    // Si se califica a un grupo, verificar que el grupo pertenezca al curso
    if (calificacion.grupoId) {
        const grupo = await grupoRepository.getGrupoById(calificacion.grupoId);
        if (!grupo || grupo.cursoId !== calificacion.cursoId)
            throw new NotFoundError("Grupo en Curso");
    }

    // Si la calificacion tiene asociado un mural
    if (calificacion.muralId) {
        const mural = await muralRepository.getMuralById(calificacion.muralId);

        // Verificar que el mural pertenezca al curso
        if (!mural || mural.cursoId !== calificacion.cursoId)
            throw new NotFoundError("Mural en Curso");

        // Verificar si la rubrica asociada al mural coincide con la rubrica de la calificacion
        if (mural.rubricaId !== calificacion.rubricaId)
            throw new InvalidValueError("Mural", "rubricaId");
    }

    // Verificacion adicional para chequear que
    // - la dimension de valores se corresponda con la cantidad de criterios de la rubrica
    // - cada valor este entre 0 y length de niveles de la rubrica
    const rubrica = await rubricaRepository.getRubricaById(calificacion.rubricaId);
    if (!rubrica) throw new NotFoundError("Rubrica");

    if (calificacion.valores.length !== rubrica.criterios.length ||
        (!calificacion.isParcial && calificacion.valores.some((valor: number) => valor < 0 || valor >= rubrica.niveles.length)))
        throw new InvalidValueError("Calificacion", "valores");


    const newCalificacion = await califcacionRepository.createOrUpdateCalificacion(calificacion);
    return newCalificacion;

}

/*
    Obtener las calificaciones de un curso (opcionalmente aquellas asociadas a una rubrica en particular)
*/
async function getCalificacionesFromCurso(idCurso: string, limit: number, offset: number, params: { idRubrica?: string, idMural?: string, grupo?: boolean, alumno?: boolean, nombreUser?: string }) {

    params.nombreUser = params.nombreUser?.toLowerCase();

    const calificaciones = await califcacionRepository.getCalificacionesFromCurso(idCurso, limit, offset, params);
    return calificaciones;

}

async function getCalificacionParcial(idRubrica: string, idMural: string | null, idDocente: string, idGrupo: string | null, idAlumno: string | null) {

    const calificacion = await califcacionRepository.getCalificacionParcial(idRubrica, idMural, idDocente, idGrupo, idAlumno);
    return calificacion;

}

export type CalificacionCSV = {
    fecha: string,
    alumno: string,
    grupo: string,
    observaciones: string,
    tipo_evaluacion: string,
    mural: string,
    rubrica: string,
    puntaje: string,
    criterio1: string,
    criterio2: string,
    criterio3: string,
    criterio4: string,
    criterio5: string,
    criterio6: string,
    criterio7: string,
    criterio8: string,
    criterio9: string,
    criterio10: string,
}

export type Nivel = {
    nombre: string,
    puntaje?: number
}

export type Criterio = {
    nombre: string,
    descripciones: string[]
}

async function getCSVofCalificacionesFromCurso(idCurso: string): Promise<CalificacionCSV[]> {

    const calificaciones = await califcacionRepository.getCalificacionesFromCurso(idCurso, 0, 0, {});

    const calificacionesCSV: CalificacionCSV[] = [];
    calificaciones.result.forEach(cal => {

        // fecha
        const fecha = new Date(cal.fecha)
        const fechaAMostrar = fecha.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: "2-digit", month: "2-digit", year: "2-digit" }) + " a las " + fecha.toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: "2-digit", minute: "2-digit" }) + " hs."

        // Alumno o grupo
        let entity = cal.grupoModel ?
            `Grupo ${cal.grupoModel.numero}: ` + (cal.grupoModel.integrantesModel?.map((int: Usuario) => toMayusFirstLetters(int.nombre)).join(", "))
            : toMayusFirstLetters(cal.usuarioModel.nombre);

        // tipo de calificacion
        const tipo = cal.muralId ? ("Mural (" + (cal?.grupoId ? `grupal)` : "individual)"))
            : cal.grupoId ? `Grupal` : "Individual"

        // puntaje
        const puntaje = cal.rubricaModel?.niveles[0].puntaje ?
            cal?.rubricaModel?.criterios.reduce((accumulator: number, criterio: Criterio, i: number) => accumulator + (cal.rubricaModel?.niveles[cal.valores[i]].puntaje ?? 0), 0)
            :
            null;
        const puntajeTotal = cal?.rubricaModel?.niveles[0].puntaje ?
            Math.max(...cal?.rubricaModel?.niveles.map((nivel: Nivel) => nivel.puntaje ?? 0)) * cal?.rubricaModel?.criterios.length
            :
            null;
        const porcentaje = puntaje && puntajeTotal ? `${(100 * puntaje / puntajeTotal).toFixed(2)}% (${puntaje}/${puntajeTotal})` : "-"

        // criterios
        let criterios: any = {}
        cal.rubricaModel?.criterios.forEach((criterio: Criterio, i: number) => {
            const nivelEvaluado = cal.valores[i];
            criterios[`criterio${i + 1}`] = criterio.nombre + " (" + cal.rubricaModel?.niveles[nivelEvaluado]?.nombre + ")";
        })
        for (let i = Object.keys(criterios).length; i < 10; i++) {
            criterios[`criterio${i + 1}`] = "-";
        }

        const calificacionCSV: CalificacionCSV = {
            fecha: fechaAMostrar,
            alumno: cal.usuarioModel ? entity : "-",
            grupo: cal.grupoModel ? entity : "-",
            tipo_evaluacion: tipo,
            mural: cal.muralModel?.nombre ?? "-",
            rubrica: toMayusFirstLetters(cal.rubricaModel?.nombre),
            puntaje: porcentaje,
            observaciones: cal.observaciones,
            ...criterios
        }

        calificacionesCSV.push(calificacionCSV);
    });

    return calificacionesCSV;

}

function toMayusFirstLetters(str: string) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

}

async function getScreenshotPath(idCurso: string, idCalificacion: string) {
    const path = await CalificacionRepository.getInstance().getScreenshotPath(idCurso, idCalificacion);
    if (!path) throw new NotFoundError("Calificacion");
    return path;
}

export default { getCalificacionesFromUser, createCalificacion, getCalificacionesFromCurso, 
    getCalificacionParcial, getCSVofCalificacionesFromCurso, getScreenshotPath, };