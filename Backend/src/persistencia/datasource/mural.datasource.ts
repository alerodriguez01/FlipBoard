import { Mural } from "@prisma/client";

export default interface MuralDataSource {
    getMuralesFromCurso(idCurso: string): Promise<Mural[]>,
    getMuralById(idMural: string): Promise<Mural | null>,
    getMuralByIdWithRubrica(idMural: string): Promise<Mural | null>
    asociateRubricaToMural(idMural: string, idRubrica: string): Promise<Mural>
    createMural(mural: Mural): Promise<Mural>
    // ir agregando métodos restantes
}