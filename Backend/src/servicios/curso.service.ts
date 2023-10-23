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
async function getCursoById(idCurso: string): Promise<Curso | null> {

    const curso = await cursoRepository.getCursoById(idCurso);
    if(!curso) throw new NotFoundError("Curso")
    return curso;

}

/*
    Guardar curso
*/
async function createCurso(body: Curso) : Promise<Curso> {

    // Verificar existencia de docentes
    const docente = await usuarioRepository.getUsuarioById(body.docentes[0])

    if(!docente) throw new NotFoundError("Docente");

    // check if mail is valid
    if (!validator.default.isEmail(body.emailContacto))
        throw new InvalidValueError('Curso', 'EmailContacto');

    const cursoSaved = await cursoRepository.createCurso(body);

    return cursoSaved;
}

// demas metodos

export default { getCursoById, createCurso };