import { PrismaClient } from "@prisma/client";
import CalificacionDataSource from "../../repositorios/datasource/calificacion.datasource.js";
import PrismaSingleton from "./dbmanager.js";

export class CalificacionPrismaDAO implements CalificacionDataSource {

    private static INSTANCE: CalificacionPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): CalificacionPrismaDAO {
        if (!CalificacionPrismaDAO.INSTANCE) {
            CalificacionPrismaDAO.INSTANCE = new CalificacionPrismaDAO();
        }

        return CalificacionPrismaDAO.INSTANCE;
    }

    // metodos
}