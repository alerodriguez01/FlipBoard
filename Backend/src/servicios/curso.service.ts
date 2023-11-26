import { Curso, Mural, Rubrica } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import validator from "validator";

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
async function createCurso(body: Curso): Promise<Curso> {

    // Verificar existencia de docentes
    const docente = await usuarioRepository.getUsuarioById(body.docentes[0])

    if (!docente) throw new NotFoundError("Docente");

    // check if mail is valid
    if (!validator.default.isEmail(body.emailContacto))
        throw new InvalidValueError('Curso', 'EmailContacto');

    const cursoSaved = await cursoRepository.createCurso(body);

    return cursoSaved;
}

async function updateCurso(idCurso: string, body: Curso): Promise<Curso> {

        // Verificar existencia de docentes
        const docente = await usuarioRepository.getUsuarioById(body.docentes[0])

        if (!docente) throw new NotFoundError("Docente");
    
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

async function deleteCursoById(idCurso: string, docente: string) {

    // Verificar que el docente sea el docente del curso
    const docenteCurso = await usuarioRepository.getUsuarioById(docente);
    if (!docenteCurso) throw new NotFoundError("Docente");
    if (!docenteCurso.cursosDocente.includes(idCurso)) throw new InvalidValueError("Curso", "Docente");

    const curso = await cursoRepository.deleteCursoById(idCurso);
    return curso;
}

async function addParticipantesToCurso(idCurso: string, correos: string[]) {

    // obtener los usuarios
    // const usuarios = await usuarioRepository.getUsuariosByCorreo(correos);

    const curso = await cursoRepository.addParticipantesToCurso(idCurso, correos);
    if (!curso) throw new NotFoundError("Curso");
    return curso;
}

// demas metodos

export default { getCursoById, createCurso, getCursos, deleteCursoById, addParticipantesToCurso, updateCurso };