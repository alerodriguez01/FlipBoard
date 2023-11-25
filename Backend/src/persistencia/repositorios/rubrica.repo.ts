import { RubricaPrismaDAO } from "../prisma/dao/rubrica.dao.js";
import { RubricaDataSource } from "../datasource/rubrica.datasource.js";
import { Rubrica } from "@prisma/client";


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
        Obtener rubrica por id
    */
    async getRubricaById(id: string) {
        return await this.rubricaDAO.getRubricaById(id);
    }

    /**
     * Crear rubrica
     */
    async createRubrica(rubrica: Rubrica) {
        return await this.rubricaDAO.createRubrica(rubrica);
    }

    /**
     * Cargar todas las rubricas del usuario idUsuario
     */
    async getAllRubricasByUserId(userId: string, nombreRub?: string) {
        return await this.rubricaDAO.getAllRubricasByUserId(userId, nombreRub);
    }

    /**
     * Asociar rubrica a los alumnos de un curso
     */
    async asociateRubricaAlumnosToCurso(idCurso: string, idRubrica: string) {
        return await this.rubricaDAO.asociateRubricaAlumnosToCurso(idCurso, idRubrica);
    }

    /**
     * Asociar rubrica a los grupos de un curso
     */
    async asociateRubricaGruposToCurso(idCurso: string, idRubrica: string) {
        return await this.rubricaDAO.asociateRubricaGruposToCurso(idCurso, idRubrica);
    }

    async deleteRubricaById(idRubrica: string) {
        return await this.rubricaDAO.deleteRubricaById(idRubrica);
    }

    // demas metodos
}
