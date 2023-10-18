import { MuralPrismaDAO } from "../daos/prisma/mural.dao.js";
import MuralDataSource from "./datasource/mural.datasource.js";

export class MuralRepository implements MuralDataSource {

    private static INSTANCE: MuralRepository;
    private muralDAO: MuralDataSource;

    private constructor() {
        this.muralDAO = MuralPrismaDAO.getInstance();
     }

    public static getInstance(): MuralRepository {
        if (!MuralRepository.INSTANCE) {
            MuralRepository.INSTANCE = new MuralRepository();
        }

        return MuralRepository.INSTANCE;
    }

    /*
        Cargar murales de un curso
    */
    async getMuralesFromCurso(idCurso: string) {
        return await this.muralDAO.getMuralesFromCurso(idCurso);
    }

    // demas metodos
}
