import { Curso, PrismaClient } from "@prisma/client";
import CursoDataSource from "../../datasource/curso.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { InvalidValueError } from "../../../excepciones/RepoErrors.js";

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
                }
            }
        });

        return cursoSaved;
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
            const curso = await this.prisma.curso.delete({
                where: {
                    id: idCurso
                }
            });
            return curso;

        } catch (err) {
            throw new InvalidValueError("Curso", "idCurso"); // el id no tiene los 12 bytes
        }

    }

    async deleteAlumnoFromCurso(idCurso: string, idAlumno: string): Promise<Curso | null> {

        try {
            const curso = await this.prisma.curso.update({
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

    // demas metodos
}