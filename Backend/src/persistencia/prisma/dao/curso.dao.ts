import { Curso, PrismaClient } from "@prisma/client";
import CursoDataSource from "../../datasource/curso.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { DeleteError, InvalidValueError, NotFoundError } from "../../../excepciones/RepoErrors.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

export class CursoPrismaDAO implements CursoDataSource {

    private static INSTANCE: CursoPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): CursoPrismaDAO {
        if (!CursoPrismaDAO.INSTANCE) {
            CursoPrismaDAO.INSTANCE = new CursoPrismaDAO();
        }

        return CursoPrismaDAO.INSTANCE;
    }

    /*
        Cargar curso por id
    */
    async getCursoById(idCurso: string): Promise<Curso | null> {
        try {
            const curso = await this.prisma.curso.findUnique({
                where: {
                    id: idCurso
                }
            });

            return curso

        } catch (error) {
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }
    }

    /*
        Guardar curso
    */
    async createCurso(curso: Curso): Promise<Curso> {
        const cursoSaved = await this.prisma.curso.create({
            data: {
                ...curso,
                docentesModel: {
                    connect: [{ id: curso.docentes[0] }]
                },
                participantesUser: {
                    connect: [{ id: curso.docentes[0] }]
                }
            }
        });

        return cursoSaved;
    }

    async updateCurso(idCurso: string, curso: Curso): Promise<Curso> {
        const cursoUpdated = await this.prisma.curso.update({
            where: {
                id: idCurso
            },
            data: {
                ...curso,
            }
        });

        return cursoUpdated;
    }

    /*
        Obtener todos los cursos
    */
    async getCursos(): Promise<Curso[]> {
        const cursos = await this.prisma.curso.findMany();
        return cursos;
    }

    /*
          agregar usuario a curso
      */
    async addUsuario(idCurso: string, idUser: string) {
        try {
            const curso = await this.prisma.curso.update({
                where: {
                    id: idCurso,
                },
                data: {
                    participantesUser: {
                        connect: { id: idUser }
                    }
                }
            });
            return curso;
        } catch (err) {
            //no existe el curso o el usuario, o error de prisma
            return null;
        }
    }

    /**
     * Cargar todas las rubricas de los alumnos del curso
     */
    async getCursoByIdWithRubricaAlumnos(idCurso: string) {

        try {
            return await this.prisma.curso.findUnique({
                where: {
                    id: idCurso
                },
                include: { rubricasAlumnosModel: true }
            });
        } catch (err) {
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }

    }

    /**
     * Cargar todas las rubricas de los alumnos del curso
     */
    async getCursoByIdWithRubricaGrupos(idCurso: string) {

        try {
            return await this.prisma.curso.findUnique({
                where: {
                    id: idCurso
                },
                include: { rubricasGruposModel: true }
            });
        } catch (err) {
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }

    }

    async deleteCursoById(idCurso: string): Promise<Curso | null> {

        try {

            return await this.prisma.$transaction(async (tx) => {

                // eliminar todas las calificaciones del curso
                await tx.calificacion.deleteMany({
                    where: {
                        cursoId: idCurso
                    }
                });

                // eliminar todos los grupos del curso
                await tx.grupo.deleteMany({
                    where: {
                        cursoId: idCurso
                    }
                });

                // eliminar todos los murales del curso
                await tx.mural.deleteMany({
                    where: {
                        cursoId: idCurso
                    }
                });

                // desconectar todos los docentes y alumnos
                const usuarios = await tx.usuario.findMany({
                    where: {
                        OR: [
                            { cursosAlumnoModel: { some: { id: idCurso } } },
                            { cursosDocenteModel: { some: { id: idCurso } } },
                        ]
                    }
                });
                await tx.curso.update({
                    where: {
                        id: idCurso
                    },
                    data: {
                        docentesModel: {
                            disconnect: usuarios.map((usuario) => ({ id: usuario.id }))
                        },
                        participantesUser: {
                            disconnect: usuarios.map((usuario) => ({ id: usuario.id }))
                        }
                    }
                })

                // eliminar el curso
                const curso = await tx.curso.delete({
                    where: {
                        id: idCurso
                    }
                });
                return curso;
            });


        } catch (err) {
            //if (err instanceof PrismaClientKnownRequestError && err.code === "P2014") throw new DeleteError("Curso", ["Grupo", "Calificacion", "Mural"]); // ya existe una relacion y no se puede eliminar
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }

    }

    async deleteAlumnoFromCurso(idCurso: string, idAlumno: string): Promise<Curso | null> {

        try {

            return await this.prisma.$transaction(async (tx) => {

                // borro todas las calificaciones de usuario
                await tx.calificacion.deleteMany({
                    where: {
                        AND: [
                            { usuarioId: idAlumno },
                            { cursoId: idCurso }
                        ]
                    }
                })

                // eliminar usuario de todos los grupos en los que participa
                /// obtener grupos
                const grupos = await tx.grupo.findMany({
                    where: {
                        cursoId: idCurso,
                        integrantes: { has: idAlumno }
                    }
                });

                /// sacar relacion usuario-grupo
                await tx.usuario.update({
                    where: {
                        id: idAlumno
                    },
                    data: {
                        gruposModel: {
                            disconnect: grupos.map((grupo) => ({ id: grupo.id }))
                        }
                    }
                });

                /// eliminar calificaciones de grupos que quedan vacios
                await tx.calificacion.deleteMany({
                    where: {
                        AND: [
                            { grupoModel: { integrantes: { isEmpty: true } } },
                            { cursoId: idCurso }
                        ]
                    }
                })
                /// eliminar grupos vacios
                await tx.grupo.deleteMany({
                    where: {
                        cursoId: idCurso,
                        integrantes: { isEmpty: true }
                    }
                });

                const curso = await tx.curso.update({
                    where: {
                        id: idCurso
                    },
                    data: {
                        participantesUser: {
                            disconnect: { id: idAlumno }
                        }
                    }
                });
                return curso;
            })

        } catch (err) {
            throw new InvalidValueError("Curso o Alumno", "idCurso o idAlumno"); // el id no tiene los 12 bytes
        }

    }

    async addParticipantesToCurso(idCurso: string, correos: string[]): Promise<Curso | null> {
        try {
            const curso = await this.prisma.curso.update({
                where: {
                    id: idCurso
                },
                data: {
                    participantesUser: {
                        connect: [...correos.map((correo: string) => ({ correo }))]
                    }
                }
            })
            return curso;

        } catch (error) {
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }
    }

    async addOrDeleteDocenteToCurso(idCurso: string, idDocente: string, agregar: boolean): Promise<Curso | null> {

        let query: any = {
            where: {
                id: idCurso
            },
            data: {
                docentesModel: {
                    // connect: { id: idDocente }
                }
            }
        };

        if (agregar) {
            query.data.docentesModel.connect = { id: idDocente }; // lo conecto como docente
        } else {
            query.data.docentesModel.disconnect = { id: idDocente }; // lo desconecto como docente
        }

        try {
            return await this.prisma.curso.update(query);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") throw new NotFoundError("Docente") // el docente no existe
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }
    }

    // demas metodos
}