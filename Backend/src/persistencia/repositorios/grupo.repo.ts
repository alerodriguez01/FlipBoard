import { Grupo } from "@prisma/client";
import GrupoDataSource from "../datasource/grupo.datasource.js";
import { GrupoPrismaDAO } from "../prisma/dao/grupo.dao.js";


export class GrupoRepository implements GrupoDataSource {

    private static INSTANCE: GrupoRepository;
    private grupoDao: GrupoDataSource;

    private constructor() {
        this.grupoDao = GrupoPrismaDAO.getInstance();
     }

    public static getInstance(): GrupoRepository {
        if (!GrupoRepository.INSTANCE) {
            GrupoRepository.INSTANCE = new GrupoRepository();
        }

        return GrupoRepository.INSTANCE;
    }

    // metodos
    public async getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number): Promise<Grupo[] | null> {
        return await this.grupoDao.getGruposFromCurso(idCurso, integrante, limit, offset);
    }

}
