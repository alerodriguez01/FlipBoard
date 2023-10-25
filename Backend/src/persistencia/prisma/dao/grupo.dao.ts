import { Grupo, PrismaClient } from "@prisma/client";
import GrupoDataSource from "../../datasource/grupo.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { InvalidValueError } from "../../../excepciones/RepoErrors.js";

export class GrupoPrismaDAO implements GrupoDataSource {

    private static INSTANCE: GrupoPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): GrupoPrismaDAO {
        if (!GrupoPrismaDAO.INSTANCE) {
            GrupoPrismaDAO.INSTANCE = new GrupoPrismaDAO();
        }

        return GrupoPrismaDAO.INSTANCE;
    }

    // metodos
    public async getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number): Promise<Grupo[] | null> {

        let query = {
            skip: offset,
            where: {
                AND: [
                    { cursoId: idCurso },
                    { integrantesModel: { some: { nombre: { contains: integrante.toLowerCase() } } } }
                ]
            },
            include: { integrantesModel: true }
        }

        try {
            if (limit === 0) return await this.prisma.grupo.findMany(query)
            else return await this.prisma.grupo.findMany({ ...query, take: limit })

        } catch (error) {
            throw new InvalidValueError("Grupo", "idCurso"); // el id no tiene los 12 bytes
        }
    }
}