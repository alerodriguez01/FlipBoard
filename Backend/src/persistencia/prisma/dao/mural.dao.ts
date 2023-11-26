import { Mural, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import MuralDataSource from "../../datasource/mural.datasource.js";
import { InvalidValueError, NotFoundError } from "../../../excepciones/RepoErrors.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

export class MuralPrismaDAO implements MuralDataSource {

    private static INSTANCE: MuralPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): MuralPrismaDAO {
        if (!MuralPrismaDAO.INSTANCE) {
            MuralPrismaDAO.INSTANCE = new MuralPrismaDAO();
        }

        return MuralPrismaDAO.INSTANCE;
    }


    /*
        Cargar murales de un curso
    */
    public async getMuralesFromCurso(idCurso: string): Promise<Mural[]> {

        try {
            const murales = await this.prisma.mural.findMany({
                where: {
                    cursoId: idCurso
                },
                orderBy: {
                    fechaCreacion: "desc"
                }
            })

            return murales;

        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    /*
        Traer mural por id
    */
    public async getMuralById(idMural: string): Promise<Mural | null> {

        try {
            const mural = await this.prisma.mural.findUnique({
                where: {
                    id: idMural
                }
            })

            return mural;

        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    /*
        Traer mural por id junto a su rubrica asociada
    */
    public async getMuralByIdWithRubrica(idMural: string): Promise<Mural | null> {

        try {
            const mural = await this.prisma.mural.findUnique({
                where: {
                    id: idMural
                },
                include: {
                    rubricaModel: true
                }
            })

            return mural;

        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    /*
        Asociar una rubrica al mural
    */
    public async asociateRubricaToMural(idMural: string, idRubrica: string) {

        try {
            return await this.prisma.mural.update({
                where: {
                    id: idMural
                },
                data: {
                    rubricaModel: { connect: { id: idRubrica } }
                }
            })

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Rubrica o Mural", "idRubrica o idMural"); // el idRubrica o idMural no tiene los 12 bytes
            throw new NotFoundError("Rubrica o Mural"); // no se encontro la rubrica o curso
        }

    }

    /*
        Crear un nuevo mural
    */
    public async createMural(mural: Mural) {

        let query: any = {
            data: {
                nombre: mural.nombre,
                descripcion: mural.descripcion,
                contenido: mural.contenido,
                cursoModel: { connect: { id: mural.cursoId } },
                fechaCreacion: new Date()
            }
        }

        if(mural.rubricaId) query.data.rubricaModel = { connect: { id: mural.rubricaId } }

        try {
            return await this.prisma.mural.create(query)

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Curso o Rubrica", "id"); // el id no tiene los 12 bytes
            throw new NotFoundError("Curso o Rubrica"); // no se encontro alguna de las entidades
        }

    }

    public async deleteMuralById(idMural: string) {

        try {
            return await this.prisma.mural.delete({
                where: {
                    id: idMural
                }
            })

        } catch (error) {
            throw new InvalidValueError("Mural", "idMural"); // el id no tiene los 12 bytes
        }

    }

    public async updateMural(idMural: string, mural: Mural) {

        try {
            return await this.prisma.mural.update({
                where: {
                    id: idMural
                },
                data: {
                    nombre: mural.nombre,
                    descripcion: mural.descripcion,
                    rubricaModel: mural.rubricaId ? { connect: { id: mural.rubricaId } } : undefined
                }
            })

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Mural o Rubrica", "idMural o idRubrica"); // el id no tiene los 12 bytes
            throw new NotFoundError("Mural o Rubrica"); // no se encontro alguna de las entidades
        }

    }

}



