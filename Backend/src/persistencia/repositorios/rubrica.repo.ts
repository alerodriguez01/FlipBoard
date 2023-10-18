import { RubricaPrismaDAO } from "../prisma/dao/rubrica.dao.js";
import { RubricaDataSource } from "../datasource/rubrica.datasource.js";


export class RubricaRepository implements RubricaDataSource {

    private static INSTANCE: RubricaRepository;
    private rubricaDAO: RubricaDataSource;

    private constructor() {
        this.rubricaDAO = RubricaPrismaDAO.getInstance();
     }

    public static getInstance(): RubricaRepository {
        if (!RubricaRepository.INSTANCE) {
            RubricaRepository.INSTANCE = new RubricaRepository();
        }

        return RubricaRepository.INSTANCE;
    }

    /*
        Cargar murales de un curso
    */
    async getRubricaById(id: string) {
        return await this.rubricaDAO.getRubricaById(id);
    }

    // demas metodos
}
