import { Curso, Rubrica } from "@prisma/client";

type CursoRubricaAlumno = Curso & {
    rubricasAlumnosModel: Rubrica[];
}

type CursoRubricaGrupo = Curso & {
    rubricasGruposModel: Rubrica[];
}

export default interface CursoDataSource {
    getCursoById(idCurso: string): Promise<Curso | null>;
    createCurso(curso: Curso): Promise<Curso>;
    updateCurso(idCurso: string, curso: Curso): Promise<Curso>;
    getCursos(): Promise<Curso[]>;
    addUsuario(idCurso: string, idUser: string): Promise<Curso | null >;
    getCursoByIdWithRubricaAlumnos(idCurso: string) : Promise<CursoRubricaAlumno | null>,
    getCursoByIdWithRubricaGrupos(idCurso: string) : Promise<CursoRubricaGrupo | null>,
    deleteCursoById(idCurso: string): Promise<Curso | null>;
    deleteAlumnoFromCurso(idCurso: string, idAlumno: string): Promise<Curso | null>;
    addParticipantesToCurso(idCurso: string, correos: string[]): Promise<Curso | null>;
    addOrDeleteDocenteToCurso(idCurso: string, idDocente: string, agregar: boolean): Promise<Curso | null>;
    // ir agregando métodos restantes 
}