import { Curso } from "@prisma/client";
import { CursoRepository } from "../repositorios/curso.repo.js";
import { MuralRepository } from "../repositorios/mural.repo.js";
import { RubricaRepository } from "../repositorios/rubrica.repo.js";

export type CursoWithMuralesAndRubricaAsigned = Curso & {
    murales: {
        id: string;
        nombre: string;
        nombreRubricaAsignada: string;
    }[];
}

const muralRepository = MuralRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();

/*
    Cargar curso con murales (id y nombre, y mural tiene que traer la rúbrica 
    asignada -solo nombre de rúbrica asignada-)
*/
async function getCursoWithMuralesAndRubrica(idCurso: string): Promise<CursoWithMuralesAndRubricaAsigned | null> {

    const curso = await cursoRepository.getCursoById(idCurso);

    if (!curso) return null;

    const murales = await muralRepository.getMuralesFromCurso(idCurso);

    // Cuando se utiliza map con funciones asíncronas, se obtiene un array de promesas 
    // pendientes. Para resolver esto, se usa Promise.all (espera a que todas las promesas 
    // se resuelvan antes de devolver el resultado.)
    const muralesWithRubricaName = await Promise.all(murales.map(async mural => {

        const rubrica = mural.rubricaId ? await rubricaRepository.getRubricaById(mural.rubricaId) : null;

        return {
            id: mural.id,
            nombre: mural.nombre,
            nombreRubricaAsignada: rubrica ? rubrica.nombre : "No asignada"
        };

    }));

    return { ...curso, murales: muralesWithRubricaName };

}

/*
    Obtener curso por id
*/
async function getCursoById(idCurso: string): Promise<Curso | null> {

    const curso = await cursoRepository.getCursoById(idCurso);

    return curso;

}

// demas metodos

export default { getCursoWithMuralesAndRubrica, getCursoById };