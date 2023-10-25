import { Rubrica } from "@prisma/client";
import { RubricaRepository } from "../persistencia/repositorios/rubrica.repo.js";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";

const rubricaRepository = RubricaRepository.getInstance();

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
    if (rubrica.criterios.length>20 || rubrica.niveles.length > 20)
        throw new InvalidValueError('Rubrica', 'Criterios o Niveles');
    
    // la primera cond chequea que cantDescripciones == cantNiveles
    if (!rubrica.criterios.every(c => c.nombre.length<=50 && c.descripciones.length === rubrica.niveles.length) ||
        !rubrica.niveles.every(n => n.nombre.length <=50))
        throw new InvalidValueError('Rubrica', 'Criterios o Descripciones o Niveles');

    const user = await UsuarioRepository.getInstance().getUsuarioById(rubrica.usuarioId);
    if (!user) throw new NotFoundError('Usuario');

    return await RubricaRepository.getInstance().createRubrica(rubrica);

}

async function getAllRubricasByUserId(userId: string) {

    const rub = await rubricaRepository.getAllRubricasByUserId(userId);

    if (!rub) throw new NotFoundError("Usuario");

    return rub;
}

export default { getRubricaById, createRubrica, getAllRubricasByUserId };