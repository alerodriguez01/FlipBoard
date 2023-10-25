import { Mural, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import MuralDataSource from "../../datasource/mural.datasource.js";
import { InvalidValueError } from "../../../excepciones/RepoErrors.js";

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

        try {
            const murales = await this.prisma.mural.findMany({
                where: {
                    cursoId: idCurso
                }
            })
    
            return murales;
            
        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    /*
        Traer mural por id
    */
    public async getMuralById(idMural: string) : Promise<Mural | null> {

        try {
            const mural = await this.prisma.mural.findUnique({
                where: {
                    id: idMural
                }
            })
    
            return mural;
            
        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    /*
        Traer mural por id junto a su rubrica asociada
    */
    public async getMuralByIdWithRubrica(idMural: string) : Promise<Mural | null> {

        try {
            const mural = await this.prisma.mural.findUnique({
                where: {
                    id: idMural
                },
                include: {
                    rubricaModel: true
                }
            })
    
            return mural;
            
        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    // demas metodos
}



