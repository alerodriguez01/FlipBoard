import { Curso } from "@prisma/client";

export default interface CursoDataSource {
    getCursoById(idCurso: string): Promise<Curso | null>;
    saveCurso(curso: Curso): Promise<Curso>;
    // ir agregando métodos restantes 
}