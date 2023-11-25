import { Grupo } from "@prisma/client";

type PaginatedGrupos = {
    count: number,
    result: any[]
}

export default interface GrupoDataSource {
    getGruposFromCurso(idCurso: string, nombre: string, limit: number, offset: number): Promise<PaginatedGrupos | null>;
    createGrupo(grupo: Grupo) : Promise<Grupo | null>;
    getGrupoById(idGrupo: string): Promise<Grupo | null>;
    deleteGrupoFromCurso(idGrupo: string): Promise<Grupo>;
    // ir agregando métodos restantes 
}