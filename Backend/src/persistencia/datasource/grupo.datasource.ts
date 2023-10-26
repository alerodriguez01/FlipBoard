import { Grupo } from "@prisma/client";

export default interface GrupoDataSource {
    getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number): Promise<Grupo[] | null>;
    createGrupo(grupo: Grupo) : Promise<Grupo | null>;
    getGrupoById(idGrupo: string): Promise<Grupo | null>;
    // ir agregando métodos restantes 
}