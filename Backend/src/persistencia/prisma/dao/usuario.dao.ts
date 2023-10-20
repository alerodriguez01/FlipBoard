import { Usuario } from '@prisma/client';
import { PrismaClient } from "@prisma/client";
import UsuarioDataSource from "../../datasource/usuario.datasource.js";
import PrismaSingleton from "./dbmanager.js";

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
  async createUsuario(user: Usuario): Promise<Usuario | null> {

    try {
      const userCreated = await this.prisma.usuario.create({
        data: user
      });
  
      return userCreated;
      
    } catch (error) {
      // Error con algun tipo de dato (el correo ya existe, violacion unique - PrismaClientKnownRequestError -)
      // console.log(JSON.stringify(error))
      return null;
    }


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

  /*
    Obtener usuario por correo
  */
  async getUsuarioByCorreo(correo: string): Promise<Usuario | null> {

    try {
      const user = await this.prisma.usuario.findUnique({
        where: {
          correo
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