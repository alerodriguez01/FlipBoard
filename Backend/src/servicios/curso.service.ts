import { Curso, Mural, Rubrica } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import validator from "validator";
import usuarioService from "./usuario.service.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";

const cursoRepository = CursoRepository.getInstance();
const usuarioRepository = UsuarioRepository.getInstance();

/*
    Obtener curso por id
*/
async function getCursoById(idCurso: string): Promise<Curso> {

    const curso = await cursoRepository.getCursoById(idCurso);
    if (!curso) throw new NotFoundError("Curso")
    return curso;

}

/*
    Guardar curso
*/
async function createCurso(token: string, body: Curso): Promise<Curso> {

    // decode token and get the its id
    let docente = '';
    try {
        const payload = usuarioService.verifyJWT(token);
        docente = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // set docente
    body.docentes = [docente];

    // check if mail is valid
    if (!validator.default.isEmail(body.emailContacto))
        throw new InvalidValueError('Curso', 'EmailContacto');

    const cursoSaved = await cursoRepository.createCurso(body);

    return cursoSaved;
}

async function updateCurso(token: string, idCurso: string, body: Curso): Promise<Curso> {

    // decode token and get the if is superuser and its id
    let isSuperUser = false
    let superUserId = '';
    try {
        const payload = usuarioService.verifyJWT(token);
        isSuperUser = payload.superUser || false;
        superUserId = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // get the Curso
    let curso = await cursoRepository.getCursoById(idCurso);
    if (!curso) throw new NotFoundError("Curso");

    // Verificar que el docente sea superuser o el docente del curso
    if(!isSuperUser)
        if(!curso.docentes.includes(superUserId)) throw new NotAuthorizedError();

    // set docente
    body.docentes = [superUserId];

    // check if mail is valid
    if (!validator.default.isEmail(body.emailContacto))
        throw new InvalidValueError('Curso', 'EmailContacto');

    const cursoSaved = await cursoRepository.updateCurso(idCurso, body);

    return cursoSaved;
}


/*
    Obtener todos los cursos
*/
async function getCursos() {
    const cursos = await cursoRepository.getCursos();
    return cursos;
}

async function deleteCursoById(token: string, idCurso: string) {

    // decode token and get the if is superuser and its id
    let isSuperUser = false
    let superUserId = '';
    try {
        const payload = usuarioService.verifyJWT(token);
        isSuperUser = payload.superUser || false;
        superUserId = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // get the Curso
    let curso = await cursoRepository.getCursoById(idCurso);
    if (!curso) throw new NotFoundError("Curso");

    // Verificar que el docente sea superuser o el docente del curso
    if(!isSuperUser)
        if(!curso.docentes.includes(superUserId)) throw new NotAuthorizedError();

    curso = await cursoRepository.deleteCursoById(idCurso);
    return curso;
}

async function addParticipantesToCurso(idCurso: string, correos: string[]) {

    // obtener los usuarios
    // const usuarios = await usuarioRepository.getUsuariosByCorreo(correos);

    const curso = await cursoRepository.addParticipantesToCurso(idCurso, correos);
    if (!curso) throw new NotFoundError("Curso");
    return curso;
}

// Agregar docente a un curso
async function addOrDeleteDocenteToCurso(token: string, idCurso: string, idDocente: string, agregar: boolean) {

    // decode token and get the if is superuser and its id
    let isSuperUser = false
    let superUserId = '';
    try {
        const payload = usuarioService.verifyJWT(token);
        isSuperUser = payload.superUser || false;
        superUserId = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // get the Curso
    const curso = await cursoRepository.getCursoById(idCurso);
    if (!curso) throw new NotFoundError("Curso");

    // if the superuser is not superuser or is not the docente of the curso
    if(!isSuperUser)
        if(!curso.docentes.includes(superUserId)) throw new NotAuthorizedError();

    // add the docente to the curso
    const cursoUpdated = await cursoRepository.addOrDeleteDocenteToCurso(idCurso, idDocente, agregar);
    if (!cursoUpdated) throw new NotFoundError("Curso");

    return cursoUpdated;

}

// demas metodos

export default { getCursoById, createCurso, getCursos, deleteCursoById, addParticipantesToCurso, updateCurso, addOrDeleteDocenteToCurso };