import CalificacionDataSource from "../datasource/calificacion.datasource.js";
import { CalificacionPrismaDAO } from "../prisma/dao/calificacion.dao.js";


export class CalificacionRepository implements CalificacionDataSource {

    private static INSTANCE: CalificacionRepository;
    private calificacionDAO: CalificacionDataSource;

    private constructor() {
        this.calificacionDAO = CalificacionPrismaDAO.getInstance();
     }

    public static getInstance(): CalificacionRepository {
        if (!CalificacionRepository.INSTANCE) {
            CalificacionRepository.INSTANCE = new CalificacionRepository();
        }

        return CalificacionRepository.INSTANCE;
    }

    // metodos
}
