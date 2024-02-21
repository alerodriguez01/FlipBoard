import { Grupo } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { GrupoRepository } from "../persistencia/repositorios/grupo.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";
import usuarioService from "./usuario.service.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";

const grupoRepository = GrupoRepository.getInstance();
const usuarioRepository = UsuarioRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();

async function getGruposFromCurso(idCurso: string, nombre: string, limit: number, offset: number) {

    const grupos = await grupoRepository.getGruposFromCurso(idCurso, nombre, limit, offset);
    return grupos

}

async function createGrupo(grupo: Grupo) {

    if (grupo.integrantes.length < 2)
        throw new InvalidValueError("Grupo", "NroIntegrantes");

    if (new Set(grupo.integrantes).size !== grupo.integrantes.length)
        throw new InvalidValueError("Grupo", "Integrantes");

    return await grupoRepository.createGrupo(grupo);
}

async function deleteGrupoFromCurso(token: string, idGrupo: string, idCurso: string) {

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

    return await grupoRepository.deleteGrupoFromCurso(idGrupo);    
}

export default { getGruposFromCurso, createGrupo, deleteGrupoFromCurso }