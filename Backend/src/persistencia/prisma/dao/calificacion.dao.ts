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
                }
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
            // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
            // if(error instanceof PrismaClientKnownRequestError) {
            //     switch (error.code) {
            //         case 'P2023': // El id no tiene los 12 bytes
            //             throw new InvalidValueError("Calificacion", "idCurso o idUsuario");
            //     }
            // }
            throw new InvalidValueError("Calificacion", "idCurso o idUsuario");
        }
    }

    /*
        Crear calificacion
    */
    public async createCalificacion(calificacion: Calificacion) {

        let query: any = {
            data: {
                valores: calificacion.valores,
                observaciones: calificacion.observaciones,
                fecha: new Date(),
                rubricaModel: { connect: { id: calificacion.rubricaId } },
                cursoModel: { connect: { id: calificacion.cursoId } },
                docenteModel: { connect: { id: calificacion.docenteId } }
            }
        }

        if (calificacion.muralId) query.data.muralModel = { connect: { id: calificacion.muralId } }
        if (calificacion.usuarioId) query.data.usuarioModel = { connect: { id: calificacion.usuarioId } }
        if (calificacion.grupoId) query.data.grupoModel = { connect: { id: calificacion.grupoId } }

        try {
            const rubrica = await this.prisma.calificacion.create(query)
            return rubrica;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Curso, Rubrica, Usuario, Grupo o Mural", "id"); // el id no tiene los 12 bytes
            throw new NotFoundError("Curso, Rubrica, Usuario, Grupo o Mural"); // no se encontro alguna de las entidades
        }
    }

    /*
        Obtener calificaciones de un curso (opcionalmente aquellas asociadas a una rubrica en particular)
    */
    public async getCalificacionesFromCurso(idCurso: string, limit: number, offset: number, params: {idRubrica?: string, idMural?: string, grupo?: boolean, alumno?: boolean, nombreUser?: string}) {

        let query: any = {
            skip: offset,
            where: {
                AND: [{ cursoId: idCurso, }]
            },
            include: {
                usuarioModel: true,
                grupoModel: {include: {integrantesModel: true}},
            }
            // include: { rubricaModel: true } // incluir la misma rubrica en todas las calificaciones no tiene mucho sentido
        }

        if (params.idRubrica) query.where.AND.push({ rubricaId: params.idRubrica })
        if (params.idMural) query.where.AND.push({ muralId: params.idMural })
        if (params.grupo) query.where.AND.push({grupoId: {not: null}}, {OR: [{muralId: null}, {muralId: {isSet: false}}]})
        if (params.alumno) query.where.AND.push( {usuarioId: {not: null}}, {OR: [{muralId: null}, {muralId: {isSet: false}}]})
        if (params.nombreUser) 
            query.where.AND.push({OR: [
                {usuarioModel: {nombre: {contains: params.nombreUser}}}, 
                {grupoModel: {integrantesModel: { some: { nombre: { contains: params.nombreUser } } }}}
            ]});

        try {
            if (limit > 0) {
                const [califs, count] = await this.prisma.$transaction([
                    this.prisma.calificacion.findMany({ ...query, take: limit }),
                    this.prisma.calificacion.count({ where: query.where })
                ]);
                return { count: count, result: califs };
            }

            const [califs, count] = await this.prisma.$transaction([
                this.prisma.calificacion.findMany(query),
                this.prisma.calificacion.count({ where: query.where })
            ]);
            return { count: count, result: califs };

        } catch (error) {
            throw new InvalidValueError("Calificacion", "idCurso o idRubrica");
        }

    }
}