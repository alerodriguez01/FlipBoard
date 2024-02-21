import { Curso, Usuario } from '@prisma/client';
import { PrismaClient } from "@prisma/client";
import UsuarioDataSource from "../../datasource/usuario.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { InvalidValueError, NotFoundError } from '../../../excepciones/RepoErrors.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';

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
        data: { ...user, nombre: user.nombre.toLowerCase() }
      });

      return userCreated;

    } catch (error) {
      // Error con algun tipo de dato (el correo ya existe, violacion unique - PrismaClientKnownRequestError -)
      // console.log(JSON.stringify(error))
      return null;
    }


  }

  // Actualizar usuario
  async updateUsuario(idUsuario: string, nombre?: string, contrasena?: string, superUser?: boolean): Promise<Usuario> {

    let query: any = {
      where: { id: idUsuario },
      data: {}
    }

    if (nombre) query.data.nombre = nombre.toLowerCase();
    if (contrasena) query.data.contrasena = contrasena;
    if (superUser !== undefined) query.data.superUser = superUser;

    try {
      return await this.prisma.usuario.update(query);
    } catch (error) {
      throw new InvalidValueError("Usuario", "idUsuario"); // el id no tiene los 12 bytes
    }
  }

  // Eliminar usuario
  async deleteUsuario(idUsuario: string): Promise<void> {

    try {

      await this.prisma.$transaction(async (tx) => {

        // eliminar las apariciones del usuario en los cursos y grupos
        const user = await tx.usuario.update({
          where: { id: idUsuario },
          data: {
            cursosAlumnoModel: { set: [] },
            cursosDocenteModel: { set: [] },
            gruposModel: { set: [] }
          }
        });

        /// eliminar calificaciones de grupos que quedan vacios
        await tx.calificacion.deleteMany({
          where: {
            AND: [
              { grupoModel: { integrantes: { isEmpty: true } } }
            ]
          }
        })
        /// eliminar grupos vacios
        await tx.grupo.deleteMany({
          where: {
            integrantes: { isEmpty: true }
          }
        });

        // buscar todas las rubricas creadas por el usuario
        const rubricas = await tx.rubrica.findMany({ where: { usuarioId: idUsuario } });
        // obtener los ids de las rubricas
        const rubricasIds = rubricas.map(rub => rub.id);

        // eliminar todas las calificaciones del realizadas sobre el usuario, que realizo o que tiene una rubrica asociada creada por el
        await tx.calificacion.deleteMany({
          where: {
            OR: [
              { usuarioId: idUsuario },
              { docenteId: idUsuario },
              { rubricaId: { in: rubricasIds } }
            ]
          }
        });

        // desasociar las rubricas de los murales a los que se encuentra asociada
        await tx.mural.updateMany({
          where: {
            rubricaId: { in: rubricasIds }
          },
          data: {
            rubricaId: null
          }
        });

        // eliminar todos las rubricas del usuario
        await tx.rubrica.deleteMany({ where: { usuarioId: idUsuario } });

        // eliminar la salt si es usuario propio (no es google)
        if (!user.correo.startsWith("google|"))
          await tx.salt.delete({ where: { usuarioId: idUsuario } });

        // eliminar el usuario
        await tx.usuario.delete({ where: { id: idUsuario } });
      });

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Usuario", "id"); // el id no tiene los 12 bytes
      throw new NotFoundError("Usuario"); // no se encontro alguna de las entidades
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
      throw new InvalidValueError("Usuario", "idUsuario"); // el id no tiene los 12 bytes
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
          cursosAlumnoModel: {
            orderBy: { nombre: 'asc' }
          },
          cursosDocenteModel: {
            orderBy: { nombre: 'asc' }
          }
        }
      });

      return user;

    } catch (error) {
      throw new InvalidValueError("Usuario", "idCurso"); // el id no tiene los 12 bytes
    }
  }

  /*
    Obtener usuarios de un curso por nombre
    Retorna null si no existe el curso, o si ha ocurrido algun error
  */
  async getUsuariosFromCursoByNombre(idCurso: string, nombreUser: string) {

    const query = {
      where: {
        AND: [
          { nombre: { contains: nombreUser.toLowerCase() } },
          {
            OR: [
              { cursosAlumno: { has: idCurso } },
              { cursosDocente: { has: idCurso } },
            ]
          }
        ]
      },
    };

    try {
      const [users, count] = await this.prisma.$transaction([
        this.prisma.usuario.findMany(query),
        this.prisma.usuario.count({ where: query.where })
      ]);
      return { count: count, result: users };
    }
    catch (error) {
      throw new InvalidValueError("Usuario", "idCurso"); // el id no tiene los 12 bytes
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
          {
            OR: [
              { nombre: { contains: nombreUser.toLowerCase() } },
              { correo: { contains: nombreUser.toLowerCase() } }
            ]
          },
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

      if (limit === 0) {
        const [users, count] = await this.prisma.$transaction([
          this.prisma.usuario.findMany(query),
          this.prisma.usuario.count({ where: query.where })
        ]);

        return { count: count, result: users }
      }

      const [users, count] = await this.prisma.$transaction([
        this.prisma.usuario.findMany({ ...query, take: limit }),
        this.prisma.usuario.count({ where: query.where })
      ]);

      return { count: count, result: users }

    }
    catch (error) {
      throw new InvalidValueError("Usuario", "idCurso"); // el id no tiene los 12 bytes
    }
  }

  async updateUsuarioPassword(idUsuario: string, password: string) {
    try {
      return await this.prisma.usuario.update({
        where: { id: idUsuario },
        data: { contrasena: password }
      });
    } catch (error) {
      throw new InvalidValueError("Usuario", "idCurso"); // el id no tiene los 12 bytes
    }
  }

  async loginProvider(provider: string, nombre: string, correo: string) {

    // const idProvider = `${provider}|${id}` // "google|1234567890"
    const correoProvider = `${provider}|${correo}` // "google|juanperez@gmailcom"

    try {

      return await this.prisma.usuario.upsert({
        // where: { idProvider: idProvider },
        where: { correo: correoProvider },
        create: {
          nombre: nombre.toLowerCase(),
          correo: correoProvider, // "google|juanperez@gmail.com"
          contrasena: "",
          // idProvider: idProvider,
        },
        update: {
          nombre: nombre.toLowerCase(),
          correo: correoProvider
        }
      })

    } catch (error) {
      throw new Error("Hubo un problema al crear/actualizar el usuario en la bd")
    }

  }

  // demas metodos
}