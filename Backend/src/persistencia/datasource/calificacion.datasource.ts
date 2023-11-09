import { Calificacion } from "@prisma/client";

type PaginatedCalificaciones = {
    count: number,
    result: any[]
}

export default interface CalificacionDataSource {
    getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) : Promise<PaginatedCalificaciones | null>;
    createCalificacion(calificacion: Calificacion) : Promise<Calificacion>;
    getCalificacionesFromCurso(idCurso: string, limit: number, offset: number, idRubrica?: string) : Promise<PaginatedCalificaciones>;
    // ir agregando métodos restantes 
}