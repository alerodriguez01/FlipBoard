import GrupoDataSource from "../datasource/grupo.datasource.js";
import { GrupoPrismaDAO } from "../prisma/dao/grupo.dao.js";


export class GrupoRepository implements GrupoDataSource {

    private static INSTANCE: GrupoRepository;
    private calificacionDAO: GrupoDataSource;

    private constructor() {
        this.calificacionDAO = GrupoPrismaDAO.getInstance();
     }

    public static getInstance(): GrupoRepository {
        if (!GrupoRepository.INSTANCE) {
            GrupoRepository.INSTANCE = new GrupoRepository();
        }

        return GrupoRepository.INSTANCE;
    }

    // metodos
}
