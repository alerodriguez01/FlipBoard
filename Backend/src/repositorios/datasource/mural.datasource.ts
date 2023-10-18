import { Mural } from "@prisma/client";

export default interface MuralDataSource {
    getMuralesFromCurso(idCurso: string): Promise<Mural[]>,
    // ir agregando métodos restantes
}