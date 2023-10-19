import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";

const rubricaRepository = RubricaRepository.getInstance();

/*
    Obtener rubrica por id
*/
async function getRubricaById(rubricaId: string) {

    return await rubricaRepository.getRubricaById(rubricaId);

}

export default { getRubricaById };