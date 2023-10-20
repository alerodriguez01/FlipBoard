import { Usuario } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { NotFoundError } from '../../../excepciones/RepoErrors.js';
import { PrismaClient } from "@prisma/client";
import UsuarioDataSource from "../../datasource/usuario.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { PrismaClientValidationError } from '@prisma/client/runtime/library.js';

export class UsuarioPrismaDAO implements UsuarioDataSource {

  private static INSTANCE: UsuarioPrismaDAO;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = PrismaSingleton.getInstance();
  }

  public static getInstance(): UsuarioPrismaDAO {
    if (!UsuarioPrismaDAO.INSTANCE) {
      UsuarioPrismaDAO.INSTANCE = new UsuarioPrismaDAO();
    }

    return UsuarioPrismaDAO.INSTANCE;
  }

  // Crear usuario
  async createUsuario(user: Usuario): Promise<Usuario> {

    const userCreated = await this.prisma.usuario.create({
      data: { ...user }
    });

    return userCreated;

  }

  /*
    Obtener usuario por id
  */
  async getUsuarioById(id: string): Promise<Usuario | null> {

    try {
      const user = await this.prisma.usuario.findUnique({
        where: {
          id
        },
      });

      return user;

    } catch (error) {
      // Error con algun tipo de dato (el id no esta completo por ejemplo - PrismaClientKnownRequestError -)
      // console.log(JSON.stringify(error))
      return null;
    }
  }

  // demas metodos
}