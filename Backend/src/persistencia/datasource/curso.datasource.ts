import { Curso, Rubrica } from "@prisma/client";

type CursoRubricaAlumno = Curso & {
    rubricasAlumnosModel: Rubrica[];
}

export default interface CursoDataSource {
    getCursoById(idCurso: string): Promise<Curso | null>;
    createCurso(curso: Curso): Promise<Curso>;
    getCursos(): Promise<Curso[]>;
    addUsuario(idCurso: string, idUser: string): Promise<Curso | null >;
    getCursoByIdWithRubricaAlumnos(idCurso: string) : Promise<CursoRubricaAlumno | null>,
    // ir agregando métodos restantes 
}