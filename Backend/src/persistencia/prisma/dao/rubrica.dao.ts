import { Rubrica, PrismaClient } from "@prisma/client";
import PrismaSingleton from "./dbmanager.js";
import { RubricaDataSource } from "../../datasource/rubrica.datasource.js";
import { DeleteError, InvalidValueError, NotFoundError } from "../../../excepciones/RepoErrors.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";


export class RubricaPrismaDAO implements RubricaDataSource {

    private static INSTANCE: RubricaPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): RubricaPrismaDAO {
        if (!RubricaPrismaDAO.INSTANCE) {
            RubricaPrismaDAO.INSTANCE = new RubricaPrismaDAO();
        }

        return RubricaPrismaDAO.INSTANCE;
    }


    /*
        Obtener rubrica por id
    */
    async getRubricaById(id: string): Promise<Rubrica | null> {

        try {
            const rubrica = await this.prisma.rubrica.findUnique({
                where: {
                    id: id
                }
            })

            return rubrica;

        } catch (error) {
            throw new InvalidValueError("Rubrica", "idRubrica"); // el id no tiene los 12 bytes
        }
    }

    /**
     * Crear rubrica
     */
    async createRubrica(rubrica: Rubrica) {
        try {
            return await this.prisma.rubrica.create({
                data: {...rubrica, nombre: rubrica.nombre.toLowerCase()},
            });
        } catch (err) {
            return null;
        }
    }

    /**
     * Cargar todas las rubricas de un usuario
     */
    async getAllRubricasByUserId(userId: string, nombreRub?: string) {
        try {
            return await this.prisma.rubrica.findMany({
                where: {
                    AND: [
                        {usuarioId: userId},
                        {nombre: {contains: nombreRub?.toLowerCase()}}
                    ]
                }
            });
        } catch (err) {
            throw new InvalidValueError("Rubrica", "idUsuario"); // el id no tiene los 12 bytes
        }
    }

    /*
        Asociar rubrica a los alumnos de un curso
    */
    async asociateRubricaAlumnosToCurso(idCurso: string, idRubrica: string) {

        try {
            const rubrica = await this.prisma.rubrica.update({
                where: { id: idRubrica },
                data: {
                    alumnosModel: { connect: { id: idCurso } }
                }
            })
            return rubrica;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Rubrica o Curso", "idRubrica o idCurso"); // el idRubrica o idCurso no tiene los 12 bytes
            throw new NotFoundError("Rubrica o Curso"); // no se encontro la rubrica o curso
        }

    }

/*
    Asociar rubrica a los grupos de un curso
*/
    async asociateRubricaGruposToCurso(idCurso: string, idRubrica: string) {

        try {
            const rubrica = await this.prisma.rubrica.update({
                where: { id: idRubrica },
                data: {
                    gruposModel: { connect: { id: idCurso } }
                }
            })
            return rubrica;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") throw new InvalidValueError("Rubrica o Curso", "idRubrica o idCurso"); // el idRubrica o idCurso no tiene los 12 bytes
            throw new NotFoundError("Rubrica o Curso"); // no se encontro la rubrica o curso
        }

    }

    async deleteRubricaById(idRubrica: string) {

        try {

            return await this.prisma.$transaction(async (tx) => {

                // borro todas las calificaciones de la rubrica
                await this.prisma.calificacion.deleteMany({
                    where: { rubricaId: idRubrica }
                })

                const rubrica = await this.prisma.rubrica.delete({
                    where: { id: idRubrica }
                })
                return rubrica;

            });


        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") throw new InvalidValueError("Rubrica", "idRubrica"); // el idRubrica no tiene los 12 bytes
            //if (error instanceof PrismaClientKnownRequestError && error.code === "P2014") throw new DeleteError("Rubrica", ["Calificacion"]); // ya existe una relacion y no se puede eliminar
            throw new NotFoundError("Rubrica"); // no se encontro la rubrica
        }

    }

    // demas metodos

}