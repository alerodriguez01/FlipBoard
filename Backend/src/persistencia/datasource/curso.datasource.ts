import { Curso } from "@prisma/client";

export default interface CursoDataSource {
    getCursoById(idCurso: string): Promise<Curso | null>;
    // ir agregando métodos restantes 
}