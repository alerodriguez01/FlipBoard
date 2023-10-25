import { Rubrica, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import { RubricaDataSource } from "../../datasource/rubrica.datasource.js";
import { InvalidValueError } from "../../../excepciones/RepoErrors.js";


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
            throw new InvalidValueError("Rubrica", "idRubrica"); // el id no tiene los 12 bytes
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

    /**
     * Cargar todas las rubricas de un usuario
     */
    async getAllRubricasByUserId(userId: string) {
        try {
            return await this.prisma.rubrica.findMany({
                where: {
                    usuarioId: userId
                }
            });
        } catch (err) {
            throw new InvalidValueError("Rubrica", "idUsuario"); // el id no tiene los 12 bytes
        }
    }
    // demas metodos

}