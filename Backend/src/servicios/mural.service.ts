import { Mural } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { NotFoundError } from "../excepciones/RepoErrors.js";

const muralRepository = MuralRepository.getInstance();

async function getMuralById(idMural: string, rubrica: boolean) : Promise<Mural | null> {

    if(rubrica){
        const mural = await muralRepository.getMuralByIdWithRubrica(idMural);
        if(!mural) throw new NotFoundError('Mural');
        return mural;
    } 
    
    const mural = await muralRepository.getMuralById(idMural);
    if(!mural) throw new NotFoundError('Mural');
    return mural;
}

export default { getMuralById };