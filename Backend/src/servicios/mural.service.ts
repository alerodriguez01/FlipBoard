import { Mural } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";

const muralRepository = MuralRepository.getInstance();

async function getMuralById(idMural: string, rubrica: boolean) : Promise<Mural | null> {

    if(rubrica) return await muralRepository.getMuralByIdWithRubrica(idMural);
    
    return await muralRepository.getMuralById(idMural);
}

export default { getMuralById };