import { Mural, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import MuralDataSource from "../../repositorios/datasource/mural.datasource.js";

export class MuralPrismaDAO implements MuralDataSource {

    private static INSTANCE: MuralPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): MuralPrismaDAO {
        if (!MuralPrismaDAO.INSTANCE) {
            MuralPrismaDAO.INSTANCE = new MuralPrismaDAO();
        }

        return MuralPrismaDAO.INSTANCE;
    }


    /*
        Cargar murales de un curso
    */
    public async getMuralesFromCurso(idCurso: string) : Promise<Mural[]> {

        const murales = await this.prisma.mural.findMany({
            where: {
                cursoId: idCurso
            }
        })

        return murales;

    }

    // demas metodos
}



