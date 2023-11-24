import { Curso } from "@prisma/client";
import CursoDataSource from "../datasource/curso.datasource.js";
import { CursoPrismaDAO } from "../prisma/dao/curso.dao.js";


export class CursoRepository implements CursoDataSource {

    private static INSTANCE: CursoRepository;
    private cursoDAO: CursoDataSource;

    private constructor() {
        this.cursoDAO = CursoPrismaDAO.getInstance();
    }

    public static getInstance(): CursoRepository {
        if (!CursoRepository.INSTANCE) {
            CursoRepository.INSTANCE = new CursoRepository();
        }

        return CursoRepository.INSTANCE;
    }

    /*
        Cargar curso por id
    */
    async getCursoById(idCurso: string): Promise<Curso | null> {
        return await this.cursoDAO.getCursoById(idCurso);
    }

    /*
        Guardar curso
    */
    async createCurso(curso: Curso): Promise<Curso> {
        return await this.cursoDAO.createCurso(curso);
    }

    /*
        Obtener todos los cursos
    */
    async getCursos(): Promise<Curso[]> {
        return await this.cursoDAO.getCursos();
    }

    /*
        Agregar participante
    */
    async addUsuario(idCurso: string, idUser: string) {
        return await this.cursoDAO.addUsuario(idCurso, idUser);
    }

    /**
    * Cargar todas las rubricas de los alumnos del curso idCurso
    */
    async getCursoByIdWithRubricaAlumnos(idCurso: string) {
        return await this.cursoDAO.getCursoByIdWithRubricaAlumnos(idCurso);
    }

    /**
    * Cargar todas las rubricas de los alumnos del curso idCurso
    */
    async getCursoByIdWithRubricaGrupos(idCurso: string) {
        return await this.cursoDAO.getCursoByIdWithRubricaGrupos(idCurso);
    }

    async deleteCursoById(idCurso: string): Promise<Curso | null> {
        return await this.cursoDAO.deleteCursoById(idCurso);
    }

    async deleteAlumnoFromCurso(idCurso: string, idAlumno: string): Promise<Curso | null> {
        return await this.cursoDAO.deleteAlumnoFromCurso(idCurso, idAlumno);
    }

    // demas metodos
}
