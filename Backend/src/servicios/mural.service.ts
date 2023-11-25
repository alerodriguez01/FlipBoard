import { Mural } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";

const muralRepository = MuralRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();
const usuarioRepository = UsuarioRepository.getInstance();

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

    if(rubrica && murales.length > 0) {
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

/*
    Asociar una rubrica al mural
*/
async function asociateRubricaToMural(idMural: string, idRubrica: string) {

    return await muralRepository.asociateRubricaToMural(idMural, idRubrica);

}

/*
    Crear un nuevo mural
*/
async function createMural(mural: Mural, idDocente: string) {
    
    const docente = await usuarioRepository.getUsuarioById(idDocente);
    if(!docente) throw new NotFoundError('Docente');

    // Verificar que quien lo crea, sea el docente del curso
    if(!docente.cursosDocente.includes(mural.cursoId)) throw new NotFoundError('Docente en Curso');

    return await muralRepository.createMural(mural);
}

async function deleteMuralById(idMural: string, docente: string) {

    const mural = await muralRepository.getMuralById(idMural);
    if(!mural) throw new NotFoundError("Mural");

    const idCurso = mural.cursoId;

    // Verificar que el docente sea el docente del curso
    const docenteCurso = await usuarioRepository.getUsuarioById(docente);
    if(!docenteCurso) throw new NotFoundError("Docente");
    if(!docenteCurso.cursosDocente.includes(idCurso)) throw new InvalidValueError("Curso", "Docente");

    const muralDeleted = await muralRepository.deleteMuralById(idMural);
    return muralDeleted;
}

export default { getMuralById, getMuralesFromCurso, asociateRubricaToMural, createMural, deleteMuralById };