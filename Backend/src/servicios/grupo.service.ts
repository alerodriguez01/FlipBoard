import { Grupo } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { GrupoRepository } from "../persistencia/repositorios/grupo.repo.js";

const grupoRepository = GrupoRepository.getInstance();

async function getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number) {

    const grupos = await grupoRepository.getGruposFromCurso(idCurso, integrante, limit, offset);
    return grupos

}

async function createGrupo(grupo: Grupo){

    if(grupo.integrantes.length < 2)
        throw new InvalidValueError("Grupo","NroIntegrantes");

    if(new Set(grupo.integrantes).size !== grupo.integrantes.length)
        throw new InvalidValueError("Grupo", "Integrantes");

    return await grupoRepository.createGrupo(grupo);
}

export default { getGruposFromCurso, createGrupo }