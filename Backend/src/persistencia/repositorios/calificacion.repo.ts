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
    public async getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) {
        return await this.calificacionDAO.getCalificacionesFromUser(idCurso, idUsuario, rubrica, limit, offset);
    }
}
