import { Grupo } from "@prisma/client";

type PaginatedGrupos = {
    count: number,
    grupos: any[]
}

export default interface GrupoDataSource {
    getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number): Promise<PaginatedGrupos | null>;
    createGrupo(grupo: Grupo) : Promise<Grupo | null>;
    getGrupoById(idGrupo: string): Promise<Grupo | null>;
    // ir agregando métodos restantes 
}