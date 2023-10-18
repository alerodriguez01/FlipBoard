import { PrismaClient } from "@prisma/client";
import GrupoDataSource from "../../repositorios/datasource/grupo.datasource.js";
import PrismaSingleton from "./dbmanager.js";

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
}