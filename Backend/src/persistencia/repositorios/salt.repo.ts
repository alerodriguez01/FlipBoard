import { Salt } from "@prisma/client";
import SaltDataSource from "../datasource/salt.datasource.js";
import { SaltPrismaDAO } from "../prisma/dao/salt.dao.js";

export class SaltRepository implements SaltDataSource {

    private static INSTANCE: SaltRepository;
    private saltDAO: SaltDataSource;

    private constructor() {
        this.saltDAO = SaltPrismaDAO.getInstance();
    }

    public static getInstance(): SaltRepository {
        if (!SaltRepository.INSTANCE) {
            SaltRepository.INSTANCE = new SaltRepository();
        }

        return SaltRepository.INSTANCE;
    }

    async createSalt(salt: Salt) {
      return await this.saltDAO.createSalt(salt);
    }
}
