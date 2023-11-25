import { Grupo } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { GrupoRepository } from "../persistencia/repositorios/grupo.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";

const grupoRepository = GrupoRepository.getInstance();
const usuarioRepository = UsuarioRepository.getInstance();

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

async function deleteGrupoFromCurso(idGrupo: string, idCurso: string, docente: string) {

    // Verificar que el docente sea el docente del curso
    const docenteCurso = await usuarioRepository.getUsuarioById(docente);
    if (!docenteCurso) throw new NotFoundError("Docente");
    if (!docenteCurso.cursosDocente.includes(idCurso)) throw new InvalidValueError("Curso", "Docente");

    return await grupoRepository.deleteGrupoFromCurso(idGrupo);    
}

export default { getGruposFromCurso, createGrupo, deleteGrupoFromCurso }