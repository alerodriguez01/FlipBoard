
import { CalificacionRepository } from "../persistencia/repositorios/calificacion.repo.js";

const califcacionRepository = CalificacionRepository.getInstance();

async function getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) {
    
    const calificaciones = await califcacionRepository.getCalificacionesFromUser(idCurso, idUsuario, rubrica, limit, offset);
    return calificaciones;

}

export default { getCalificacionesFromUser };