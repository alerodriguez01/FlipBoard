import { Rubrica } from "@prisma/client";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";
import usuarioService from "./usuario.service.js";

const rubricaRepository = RubricaRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();

/*
    Obtener rubrica por id
*/
async function getRubricaById(rubricaId: string) {

    const rubrica = await rubricaRepository.getRubricaById(rubricaId);
    if (!rubrica) throw new NotFoundError('Rubrica');
    return rubrica

}

/**
 * Crear rubrica
 */

async function createRubrica(rubrica: Rubrica) {

    /*
        Condiciones CU-R2:
            nombreRubrica: no especifica
            tituloCriterio: 50 carac max
            tituloNivel: 50 carac max
            cant criterios: 20 max
            cant niveles: 20 max
            descripciones: no especifica
            puntajes: no especifica
     */
    if (rubrica.criterios.length > 20 || rubrica.niveles.length > 20)
        throw new InvalidValueError('Rubrica', 'Criterios o Niveles');

    // la primera cond chequea que cantDescripciones == cantNiveles
    if (!rubrica.criterios.every(c => c.nombre.length <= 200 && c.descripciones.length === rubrica.niveles.length) ||
        !rubrica.niveles.every(n => n.nombre.length <= 200))
        throw new InvalidValueError('Rubrica', 'Criterios o Descripciones o Niveles');

    const user = await UsuarioRepository.getInstance().getUsuarioById(rubrica.usuarioId);
    if (!user) throw new NotFoundError('Usuario');

    return await RubricaRepository.getInstance().createRubrica(rubrica);

}

async function getAllRubricasByUserId(userId: string, nombreRub?: string) {

    const rubricas = await rubricaRepository.getAllRubricasByUserId(userId, nombreRub);
    return rubricas;
}

/*
    Obtener las rubricas asociadas a los alumnos de un curso
*/
async function getRubricasAlumnosFromCurso(idCurso: string, nombre?: string) : Promise<Rubrica[]> {
    
        const curso = await cursoRepository.getCursoByIdWithRubricaAlumnos(idCurso);
        if (!curso) throw new NotFoundError('Curso');
        return !!nombre ? 
            curso.rubricasAlumnosModel.filter(rub => 
                    rub.nombre.toLowerCase().includes(nombre.toLowerCase())  || 
                    rub.criterios.some(c => c.nombre.toLowerCase().includes(nombre.toLowerCase()))
            )
            : 
            curso.rubricasAlumnosModel;
}

/*
    Obtener las rubricas asociadas a los grupos de un curso
*/
async function getRubricasGruposFromCurso(idCurso: string, nombre?: string) : Promise<Rubrica[]> {
    
    const curso = await cursoRepository.getCursoByIdWithRubricaGrupos(idCurso);
    if (!curso) throw new NotFoundError('Curso');
    return !!nombre ? 
        curso.rubricasGruposModel.filter(rub => 
            rub.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
            rub.criterios.some(c => c.nombre.toLowerCase().includes(nombre.toLowerCase()))
        )
        :
        curso.rubricasGruposModel;
}

/*
    Asociar una rubrica a todos los alumnos en un curso
*/
async function asociateRubricaAlumnosToCurso(idCurso: string, idRubrica: string) {

    return await rubricaRepository.asociateRubricaAlumnosToCurso(idCurso, idRubrica);

}

/*
    Asociar una rubrica a todos los grupos en un curso
*/
async function asociateRubricaGruposToCurso(idCurso: string, idRubrica: string) {

    return await rubricaRepository.asociateRubricaGruposToCurso(idCurso, idRubrica);

}

async function deleteRubricaById(token: string, idRubrica: string) {

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

    // Verificar que la rubrica le pertenezca al usuario o sea superuser
    const rubrica = await getRubricaById(idRubrica);
    if (!isSuperUser)
        if (rubrica.usuarioId !== superUserId) throw new InvalidValueError('Rubrica', 'Usuario');

    const rubricaDeleted = await rubricaRepository.deleteRubricaById(idRubrica);
    return rubricaDeleted;
}

export default { 
    getRubricaById, createRubrica, getAllRubricasByUserId, 
    getRubricasAlumnosFromCurso, getRubricasGruposFromCurso, asociateRubricaAlumnosToCurso,
    asociateRubricaGruposToCurso, deleteRubricaById
 };