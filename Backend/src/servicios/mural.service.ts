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

async function getMuralesFromCurso(idCurso: string, rubrica: boolean, nombre?: string): Promise<Mural[]> {

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

        // filtro por nombre de rubrica y criterio tambien para que quede consistente
        return muralesWithRubrica.filter((m) => 
            m.nombre.toLowerCase().includes(nombre?.toLowerCase() ?? "") ||
            m.rubricaModel?.nombre.toLowerCase().includes(nombre?.toLowerCase() ?? "") ||
            m.rubricaModel?.criterios.some((c) => c.nombre.toLowerCase().includes(nombre?.toLowerCase() ?? ""))
        );
    }

    return murales.filter((m) => m.nombre.toLowerCase().includes(nombre?.toLowerCase() ?? ""));
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

    // Verificar que el docente sea superuser o el docente del curso
    const docenteCurso = await usuarioRepository.getUsuarioById(idDocente);
    if (!docenteCurso) throw new NotFoundError("Docente");
    if (!docenteCurso.superUser) {
        if (!docenteCurso.cursosDocente.includes(mural.cursoId)) throw new InvalidValueError("Curso", "Docente");
    }

    return await muralRepository.createMural(mural);
}

async function deleteMuralById(idMural: string, docente: string) {

    const mural = await muralRepository.getMuralById(idMural);
    if (!mural) throw new NotFoundError("Mural");

    const idCurso = mural.cursoId;

    // Verificar que el docente sea superuser o el docente del curso
    const docenteCurso = await usuarioRepository.getUsuarioById(docente);
    if (!docenteCurso) throw new NotFoundError("Docente");
    if (!docenteCurso.superUser) {
        if (!docenteCurso.cursosDocente.includes(idCurso)) throw new InvalidValueError("Curso", "Docente");
    }

    const muralDeleted = await muralRepository.deleteMuralById(idMural);
    return muralDeleted;
}

async function updateMural(idMural: string, mural: Mural, idCurso: string, idDocente: string) {

    // Verificar que el docente sea superuser o el docente del curso
    const docenteCurso = await usuarioRepository.getUsuarioById(idDocente);
    if (!docenteCurso) throw new NotFoundError("Docente");
    if (!docenteCurso.superUser) {
        if (!docenteCurso.cursosDocente.includes(idCurso)) throw new InvalidValueError("Curso", "Docente");
    }

    const muralUpdated = await muralRepository.updateMural(idMural, mural);
    return muralUpdated;

}

export default { getMuralById, getMuralesFromCurso, asociateRubricaToMural, createMural, deleteMuralById, updateMural };