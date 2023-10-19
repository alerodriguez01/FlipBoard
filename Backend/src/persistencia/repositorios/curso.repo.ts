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
    async getCursoById(idCurso: string) : Promise<Curso | null> {
        return await this.cursoDAO.getCursoById(idCurso);
    }

    /*
        Guardar curso
    */
    async createCurso(curso: Curso): Promise<Curso> {
        return await this.cursoDAO.createCurso(curso);
    }

    // demas metodos
}