import { PrismaClient, Salt } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import SaltDataSource from "../../datasource/salt.datasource.js";

export class SaltPrismaDAO implements SaltDataSource {

  private static INSTANCE: SaltPrismaDAO;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = PrismaSingleton.getInstance();
  }

  public static getInstance(): SaltPrismaDAO {
    if (!SaltPrismaDAO.INSTANCE) {
      SaltPrismaDAO.INSTANCE = new SaltPrismaDAO();
    }

    return SaltPrismaDAO.INSTANCE;
  }

  async createSalt(salt: Salt) {
    return await this.prisma.salt.create({
      data: salt
    });
  }

  async getSaltByUsuarioId(userId: string) {
    return await this.prisma.salt.findUnique({
      where: {
        usuarioId: userId
      }
    });
  }

}