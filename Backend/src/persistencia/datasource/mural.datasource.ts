import { Mural } from "@prisma/client";

export default interface MuralDataSource {
    getMuralesFromCurso(idCurso: string): Promise<Mural[]>,
    getMuralById(idMural: string): Promise<Mural | null>,
    getMuralByIdWithRubrica(idMural: string): Promise<Mural | null>
    // ir agregando métodos restantes
}