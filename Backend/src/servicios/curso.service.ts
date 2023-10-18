import { Curso, Mural, Rubrica } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";


// esto no lo pude hacer andar
export type CursoWithMuralesAndRubricaAsigned = Curso & {
    murales: Mural & {
        rubricaAsignada: Rubrica | null;
    }[];
};

const muralRepository = MuralRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();

/*
    Cargar curso con murales y opcionalmente la rúbrica asignada a cada mural
*/
async function getCursoWithMurales(idCurso: string, rubrica: boolean) { // : Promise<CursoWithMuralesAndRubricaAsigned | null> {

    const curso = await cursoRepository.getCursoById(idCurso);

    if (!curso) return null;

    const murales = await muralRepository.getMuralesFromCurso(idCurso);

    // Si desea traer la rubrica asociada a cada mural
    if (rubrica) {
        // Cuando se utiliza map con funciones asíncronas, se obtiene un array de promesas 
        // pendientes. Para resolver esto, se usa Promise.all (espera a que todas las promesas 
        // se resuelvan antes de devolver el resultado.)
        const muralesWithRubrica = await Promise.all(murales.map(async (mural: Mural) => {

            const rubrica = mural.rubricaId ? await rubricaRepository.getRubricaById(mural.rubricaId) : null;

            return {
                ...mural,
                rubricaAsignada: rubrica
            };

        }));

        return { ...curso, murales: muralesWithRubrica };
    }

    return { ...curso, murales };

}

/*
    Obtener curso por id
*/
async function getCursoById(idCurso: string): Promise<Curso | null> {

    const curso = await cursoRepository.getCursoById(idCurso);

    return curso;

}

// demas metodos

export default { getCursoWithMurales, getCursoById };