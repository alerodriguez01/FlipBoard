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

        try {
            const rubrica = await this.prisma.rubrica.findUnique({
                where: {
                    id: id
                }
            })
    
            return rubrica;
            
        } catch (error) {
            // Error con algun tipo de dato (el id no esta completo por ejemplo - PrismaClientKnownRequestError -)
            // console.log(JSON.stringify(error))
            return null;
        }
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