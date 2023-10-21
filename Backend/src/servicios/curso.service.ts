import { Curso, Mural, Rubrica } from "@prisma/client";
import { MuralRepository } from "../persistencia/repositorios/mural.repo.js";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import validator from "validator";


// esto no lo pude hacer andar
export type CursoWithMuralesAndRubricaAsigned = Curso & {
    murales: Mural & {
        rubricaAsignada: Rubrica | null;
    }[];
};

const muralRepository = MuralRepository.getInstance();
const rubricaRepository = RubricaRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();
const usuarioRepository = UsuarioRepository.getInstance();

/*
    Cargar curso con murales y opcionalmente la rúbrica asignada a cada mural
*/
async function getCursoWithMurales(idCurso: string, rubrica: boolean) { // : Promise<CursoWithMuralesAndRubricaAsigned | null> {

    const curso = await cursoRepository.getCursoById(idCurso);

    if(!curso) throw new NotFoundError("Curso")

    const murales = await muralRepository.getMuralesFromCurso(idCurso);

    // Si desea traer la rubrica asociada a cada mural (y existen murales)
    if (rubrica && murales) {
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
    if(!curso) throw new NotFoundError("Curso")
    return curso;

}

/*
    Guardar curso
*/
async function createCurso(body: Curso) : Promise<Curso> {

    // Verificar existencia de docentes
    const docente = await usuarioRepository.getUsuarioById(body.docentes[0])

    if(!docente) throw new NotFoundError("Docente");

    // check if mail is valid
    if (!validator.default.isEmail(body.emailContacto))
        throw new InvalidValueError('Curso', 'EmailContacto');

    const cursoSaved = await cursoRepository.createCurso(body);

    return cursoSaved;
}

// demas metodos

export default { getCursoWithMurales, getCursoById, createCurso };