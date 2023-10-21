import { Rubrica, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import { RubricaDataSource } from "../../datasource/rubrica.datasource.js";


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
        Obtener rubrica por id
    */
    async getRubricaById(id: string) : Promise<Rubrica | null> {

        const rubrica = await this.prisma.rubrica.findUnique({
            where: {
                id: id
            }
        })

        return rubrica;
    }

    /**
     * Crear rubrica
     */
    async createRubrica(rubrica: Rubrica) {
        try{
            return await this.prisma.rubrica.create({
                data: rubrica,
            });
        } catch(err){
            return null;
        }
    }
    // demas metodos

}