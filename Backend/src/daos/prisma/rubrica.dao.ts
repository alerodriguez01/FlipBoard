import { Rubrica, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import { RubricaDataSource } from "../../repositorios/datasource/rubrica.datasource.js";


export class RubricaPrismaDAO implements RubricaDataSource {

    private static INSTANCE: RubricaPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): RubricaPrismaDAO {
        if (!RubricaPrismaDAO.INSTANCE) {
            RubricaPrismaDAO.INSTANCE = new RubricaPrismaDAO();
        }

        return RubricaPrismaDAO.INSTANCE;
    }


    /*
        Cargar murales de un curso
    */
    async getRubricaById(id: string) : Promise<Rubrica | null> {

        const rubrica = await this.prisma.rubrica.findUnique({
            where: {
                id: id
            }
        })

        return rubrica;
    }

    // demas metodos

}