import { Rubrica } from "@prisma/client";

export interface RubricaDataSource {
    getRubricaById(id: string) : Promise<Rubrica | null>,
    createRubrica(rubrica: Rubrica) : Promise<Rubrica | null>,
    getAllRubricasByUserId(userId: string) : Promise<Rubrica[] | null>,
    asociateRubricaAlumnosToCurso(idCurso: string, idRubrica: string) : Promise<Rubrica>,
    // ir agregando métodos restantes
}