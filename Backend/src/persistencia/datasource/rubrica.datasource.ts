import { Rubrica } from "@prisma/client";

export interface RubricaDataSource {
    getRubricaById(id: string) : Promise<Rubrica | null>,
    createRubrica(rubrica: Rubrica) : Promise<Rubrica | null>,
    getAllRubricasByUserId(userId: string) : Promise<Rubrica[] | null>,
    // ir agregando métodos restantes
}