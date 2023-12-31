import { Calificacion } from "@prisma/client";

type PaginatedCalificaciones = {
    count: number,
    result: any[]
}

export default interface CalificacionDataSource {
    getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) : Promise<PaginatedCalificaciones | null>;
    createOrUpdateCalificacion(calificacion: Calificacion) : Promise<Calificacion>;
    getCalificacionesFromCurso(idCurso: string, limit: number, offset: number, params: {idRubrica?: string, idMural?: string, grupo?: boolean, alumno?: boolean, nombreUser?: string}) 
        : Promise<PaginatedCalificaciones>;
    getCalificacionParcial(idRubrica: string, idMural: string | null, idDocente: string, idGrupo: string | null, idAlumno: string | null) : Promise<Calificacion | null>;
    // ir agregando métodos restantes 
}