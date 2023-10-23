import { Mural } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { NotFoundError } from "../excepciones/RepoErrors.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";

const muralRepository = MuralRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();

async function getMuralById(idMural: string, rubrica: boolean): Promise<Mural | null> {

    if (rubrica) {
        const mural = await muralRepository.getMuralByIdWithRubrica(idMural);
        if (!mural) throw new NotFoundError('Mural');
        return mural;
    }

    const mural = await muralRepository.getMuralById(idMural);
    if (!mural) throw new NotFoundError('Mural');
    return mural;
}

async function getMuralesFromCurso(idCurso: string, rubrica: boolean): Promise<Mural[]> {
    
    const murales = await muralRepository.getMuralesFromCurso(idCurso);
    if (!murales) throw new NotFoundError('Curso');

    if(rubrica) {
        // Cuando se utiliza map con funciones asíncronas, se obtiene un array de promesas 
        // pendientes. Para resolver esto, se usa Promise.all (espera a que todas las promesas 
        // se resuelvan antes de devolver el resultado.)
        
        const muralesWithRubrica = await Promise.all(murales.map(async (mural: Mural) => {

            const rubrica = mural.rubricaId ? await rubricaRepository.getRubricaById(mural.rubricaId) : null;

            return {
                ...mural,
                rubricaModel: rubrica
            };

        }));
        
        return muralesWithRubrica;
    }

    return murales;
}

export default { getMuralById, getMuralesFromCurso };