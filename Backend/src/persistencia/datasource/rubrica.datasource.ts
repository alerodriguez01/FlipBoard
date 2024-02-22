import { Rubrica } from "@prisma/client";

export interface RubricaDataSource {
    getRubricaById(id: string) : Promise<Rubrica | null>,
    createRubrica(rubrica: Rubrica) : Promise<Rubrica | null>,
    getAllRubricasByUserId(userId: string, nombreRub?: string) : Promise<Rubrica[] | null>,
    asociateRubricaAlumnosToCurso(idCurso: string, idRubrica: string) : Promise<Rubrica>,
    asociateRubricaGruposToCurso(idCurso: string, idRubrica: string) : Promise<Rubrica>,
    deleteRubricaById(idRubrica: string) : Promise<Rubrica>,
    getAllRubricas(): Promise<Rubrica[] | null>
    // ir agregando métodos restantes
}