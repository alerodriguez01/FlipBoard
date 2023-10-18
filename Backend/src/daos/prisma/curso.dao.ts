import { Curso, PrismaClient } from "@prisma/client";
import CursoDataSource from "../../repositorios/datasource/curso.datasource.js";
import PrismaSingleton from "./dbmanager.js";

export class CursoPrismaDAO implements CursoDataSource {

    private static INSTANCE: CursoPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): CursoPrismaDAO {
        if (!CursoPrismaDAO.INSTANCE) {
            CursoPrismaDAO.INSTANCE = new CursoPrismaDAO();
        }

        return CursoPrismaDAO.INSTANCE;
    }

    /*
        Cargar curso por id
    */
    async getCursoById(idCurso: string): Promise<Curso | null> {

        const curso = await this.prisma.curso.findUnique({
            where: {
                id: idCurso
            }
        });

        return curso
    }

    // demas metodos
}