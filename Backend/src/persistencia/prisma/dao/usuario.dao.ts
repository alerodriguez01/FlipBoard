import { Curso, Usuario } from '@prisma/client';
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

  /*
    Obtener usuario por id con sus cursos
  */
  async getUsuarioByIdWithCursos(id: string): Promise<Usuario | null> {

    try {
      const user = await this.prisma.usuario.findUnique({
        where: {
          id
        },
        include: {
          cursosAlumnoModel: true,
          cursosDocenteModel: true
        }
      });

      return user;

    } catch (error) {
      // Error con algun tipo de dato (el id no esta completo por ejemplo - PrismaClientKnownRequestError -)
      // console.log(JSON.stringify(error))
      return null;
    }
  }

  /*
    Obtener usuarios de un curso por nombre
    Retorna null si no existe el curso, o si ha ocurrido algun error
  */
  async getUsuariosFromCursoByNombre(idCurso: string, nombreUser: string) {
    
    try {
      return await this.prisma.usuario.findMany({
        where: {
          AND: [
            { nombre: { contains: nombreUser } },
            {
              OR: [
                { cursosAlumno: { has: idCurso } },
                { cursosDocente: { has: idCurso } },
              ]
            }
          ]
        },
      });
    }
    catch (error) {
      return null;
    }
  }

  /*
    Obtener usuarios de un curso por nombre paginado
  */
  async getUsuariosFromCursoByNombrePaginated(idCurso: string, nombreUser: string, limit: number, offset: number) {

    let query = {
      skip: offset,
      where: {
        AND: [
          { nombre: { contains: nombreUser } },
          {
            OR: [
              { cursosAlumno: { has: idCurso } },
              { cursosDocente: { has: idCurso } },
            ]
          }
        ]
      },
    }

    try {
      if (limit === 0) return await this.prisma.usuario.findMany(query);
      else return await this.prisma.usuario.findMany({...query, take: limit});
    }
    catch (error) {
      return null;
    }
  }

  // demas metodos
}