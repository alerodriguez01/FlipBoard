import { Calificacion } from "@prisma/client";

export default interface CalificacionDataSource {
    getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) : Promise<Calificacion[] | null>;
    createCalificacion(calificacion: Calificacion) : Promise<Calificacion>;
    // ir agregando métodos restantes 
}