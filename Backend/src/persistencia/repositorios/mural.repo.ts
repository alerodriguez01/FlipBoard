import { MuralPrismaDAO } from "../prisma/dao/mural.dao.js";
import MuralDataSource from "../datasource/mural.datasource.js";

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

    /*
        Traer mural por id
    */
    async getMuralById(idMural: string) {
        return await this.muralDAO.getMuralById(idMural);
    }

    /*
        Traer mural por id junto a su rubrica asociada
    */
    async getMuralByIdWithRubrica(idMural: string) {
        return await this.muralDAO.getMuralByIdWithRubrica(idMural);
    }

    // demas metodos
}
