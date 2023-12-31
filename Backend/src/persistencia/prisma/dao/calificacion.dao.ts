import { Calificacion, PrismaClient } from "@prisma/client";
import CalificacionDataSource from "../../datasource/calificacion.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { InvalidValueError, NotFoundError } from "../../../excepciones/RepoErrors.js";

export class CalificacionPrismaDAO implements CalificacionDataSource {

    private static INSTANCE: CalificacionPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): CalificacionPrismaDAO {
        if (!CalificacionPrismaDAO.INSTANCE) {
            CalificacionPrismaDAO.INSTANCE = new CalificacionPrismaDAO();
        }

        return CalificacionPrismaDAO.INSTANCE;
    }

    // metodos
    public async getCalificacionesFromUser(idCurso: string, idUsuario: string, rubrica: boolean, limit: number, offset: number) {

        let query = {
            skip: offset,
            where: {
                AND: [{ cursoId: idCurso, },
                {
                    OR: [{ usuarioId: idUsuario },
                    { grupoModel: { integrantes: { has: idUsuario } } }
                    ]
                },
                { isParcial: false }
                ]
            },
            include: {
                rubricaModel: rubrica,
                muralModel: true,
                grupoModel: {
                    include: {
                        integrantesModel: true
                    }
                },
            }
        }

        try {
            if (limit > 0) {
                const [califs, count] = await this.prisma.$transaction([
                    this.prisma.calificacion.findMany({ ...query, take: limit, orderBy: { fecha: "desc" } }),
                    this.prisma.calificacion.count({ where: query.where })
                ]);
                return { count: count, result: califs };
            }

            const [califs, count] = await this.prisma.$transaction([
                this.prisma.calificacion.findMany({ ...query, orderBy: { fecha: "desc" } }),
                this.prisma.calificacion.count({ where: query.where })
            ]);
            return { count: count, result: califs };
        } catch (error) {
            // https//www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
            // if(error instanceof PrismaClientKnownRequestError) {
            //     switch (error.code) {
            //         case 'P2023': // El id no tiene los 12 bytes
            //             throw new InvalidValueError("Calificacion", "idCurso o idUsuario");
            //     }
            // }
            throw new InvalidValueError("Calificacion", "idCurso o idUsuario");
        }
    }

    private async findCalificacionParcial(idRubrica: string, idMural: string | null, idDocente: string, idGrupo: string | null, idAlumno: string | null) {
        return await this.prisma.calificacion.findFirst({
            where: {
                // busco que exista una calificacion que sea parcial, tenga un user o grupo, coincida con el mural si existe y sea del docente
                // y que la rubrica coincida con la que se quiere crear (tiene que ser unica, por eso el uso de findFirst)
                AND: [
                    { isParcial: true },
                    { OR: [{ usuarioId: idAlumno }, { grupoId: idGrupo }] },
                    { muralId: idMural || undefined },
                    { docenteId: idDocente },
                    { rubricaId: idRubrica }
                ]
            }
        })
    }

    /*
        Obtener calificacion parcial
    */
    public async getCalificacionParcial(idRubrica: string, idMural: string | null, idDocente: string, idGrupo: string | null, idAlumno: string | null) {

        try {
            return await this.findCalificacionParcial(idRubrica, idMural, idDocente, idGrupo, idAlumno);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Curso, Rubrica, Usuario, Grupo o Mural", "id"); // el id no tiene los 12 bytes
            throw new NotFoundError("Curso, Rubrica, Usuario, Grupo o Mural"); // no se encontro alguna de las entidades    
        }

    }

    /*
        Crear calificacion o actualizar una calificacion parcial
    */
    public async createOrUpdateCalificacion(calificacion: Calificacion) {

        try {

            return await this.prisma.$transaction(async (tx) => {

                const calificacionParcial = await this.findCalificacionParcial(calificacion.rubricaId, calificacion.muralId, calificacion.docenteId, calificacion.grupoId, calificacion.usuarioId);
                // console.log(calificacionParcial)
                const calificacionReturn = await this.prisma.calificacion.upsert({
                    where: {
                        id: calificacionParcial?.id ?? "333333333333333333333333" // me pide un id si o si
                    },
                    create: {
                        valores: calificacion.valores,
                        observaciones: calificacion.observaciones,
                        fecha: new Date(),
                        rubricaModel: { connect: { id: calificacion.rubricaId } },
                        cursoModel: { connect: { id: calificacion.cursoId } },
                        docenteModel: { connect: { id: calificacion.docenteId } },
                        muralModel: calificacion.muralId ? { connect: { id: calificacion.muralId } } : undefined,
                        usuarioModel: calificacion.usuarioId ? { connect: { id: calificacion.usuarioId } } : undefined,
                        grupoModel: calificacion.grupoId ? { connect: { id: calificacion.grupoId } } : undefined,
                        isParcial: calificacion.isParcial
                    },
                    update: {
                        valores: calificacion.valores,
                        observaciones: calificacion.observaciones,
                        fecha: new Date(),
                        isParcial: calificacion.isParcial
                    }
                })

                return calificacionReturn;

            })

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Curso, Rubrica, Usuario, Grupo o Mural", "id"); // el id no tiene los 12 bytes
            throw new NotFoundError("Curso, Rubrica, Usuario, Grupo o Mural"); // no se encontro alguna de las entidades
        }
    }

    /*
        Obtener calificaciones de un curso (opcionalmente aquellas asociadas a una rubrica en particular)
    */
    public async getCalificacionesFromCurso(idCurso: string, limit: number, offset: number, params: { idRubrica?: string, idMural?: string, grupo?: boolean, alumno?: boolean, nombreUser?: string }) {
        let query: any = {
            skip: offset,
            where: {
                AND: [{ cursoId: idCurso, }, { isParcial: false }]
            },
            include: {
                usuarioModel: true,
                grupoModel: { include: { integrantesModel: true } },
            }
            // include: { rubricaModel: true } // incluir la misma rubrica en todas las calificaciones no tiene mucho sentido
        }

        if (params.idRubrica) query.where.AND.push({ rubricaId: params.idRubrica })
        if (params.idMural) query.where.AND.push({ muralId: params.idMural })
        if (params.grupo) query.where.AND.push({ grupoId: { not: null } }, { OR: [{ muralId: null }, { muralId: { isSet: false } }] })
        if (params.alumno) query.where.AND.push({ usuarioId: { not: null } }, { OR: [{ muralId: null }, { muralId: { isSet: false } }] })
        if (params.nombreUser)
            query.where.AND.push({
                OR: [
                    { usuarioModel: { nombre: { contains: params.nombreUser } } },
                    { grupoModel: { integrantesModel: { some: { nombre: { contains: params.nombreUser } } } } }
                ]
            });

        try {
            if (limit > 0) {
                const [califs, count] = await this.prisma.$transaction([
                    this.prisma.calificacion.findMany({ ...query, take: limit, orderBy: { fecha: "desc" } }),
                    this.prisma.calificacion.count({ where: query.where })
                ]);
                return { count: count, result: califs };
            }

            const [califs, count] = await this.prisma.$transaction([
                this.prisma.calificacion.findMany({ ...query, orderBy: { fecha: "desc" } }),
                this.prisma.calificacion.count({ where: query.where })
            ]);
            return { count: count, result: califs };

        } catch (error) {
            throw new InvalidValueError("Calificacion", "idCurso o idRubrica");
        }

    }
}