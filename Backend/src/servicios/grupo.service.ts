import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { GrupoRepository } from "../persistencia/repositorios/grupo.repo.js";

const grupoRepository = GrupoRepository.getInstance();

async function getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number) {


    const grupos = await grupoRepository.getGruposFromCurso(idCurso, integrante, limit, offset);

    if(!grupos) throw new NotFoundError("Curso")

    return grupos

}

export default { getGruposFromCurso }