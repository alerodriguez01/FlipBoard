import { Mural } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import usuarioService from "./usuario.service.js";

const cursoRepository = CursoRepository.getInstance();

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

    if (rubrica && murales.length > 0) {
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
async function createMural(token: string, mural: Mural) {

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
    let curso = await cursoRepository.getCursoById(mural.cursoId);
    if (!curso) throw new NotFoundError("Curso");

    // Verificar que el docente sea superuser o el docente del curso
    if(!isSuperUser)
        if(!curso.docentes.includes(superUserId)) throw new NotAuthorizedError();

    return await muralRepository.createMural(mural);
}

async function deleteMuralById(token: string, idMural: string) {

    const mural = await muralRepository.getMuralById(idMural);
    if (!mural) throw new NotFoundError("Mural");

    const idCurso = mural.cursoId;

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

    const muralDeleted = await muralRepository.deleteMuralById(idMural);
    return muralDeleted;
}

async function updateMural(token: string, idMural: string, mural: Mural, idCurso: string) {

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

    const muralUpdated = await muralRepository.updateMural(idMural, mural);
    return muralUpdated;

}

export default { getMuralById, getMuralesFromCurso, asociateRubricaToMural, createMural, deleteMuralById, updateMural };