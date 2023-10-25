import { Calificacion } from "@prisma/client";

export default interface CalificacionDataSource {
    getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) : Promise<Calificacion[] | null>;
    // ir agregando métodos restantes 
}