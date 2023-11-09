import { Grupo, PrismaClient } from "@prisma/client";
import GrupoDataSource from "../../datasource/grupo.datasource.js";
import PrismaSingleton from "./dbmanager.js";
import { InvalidValueError } from "../../../excepciones/RepoErrors.js";

export class GrupoPrismaDAO implements GrupoDataSource {

    private static INSTANCE: GrupoPrismaDAO;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = PrismaSingleton.getInstance();
    }

    public static getInstance(): GrupoPrismaDAO {
        if (!GrupoPrismaDAO.INSTANCE) {
            GrupoPrismaDAO.INSTANCE = new GrupoPrismaDAO();
        }

        return GrupoPrismaDAO.INSTANCE;
    }

    // metodos
    public async getGruposFromCurso(idCurso: string, integrante: string, limit: number, offset: number) {

        let query = {
            skip: offset,
            where: {
                AND: [
                    { cursoId: idCurso },
                    { integrantesModel: { some: { nombre: { contains: integrante.toLowerCase() } } } }
                ]
            },
            include: { integrantesModel: true }
        }

        try {
            if(limit === 0) {
                const [grupos, count] = await this.prisma.$transaction([
                  this.prisma.grupo.findMany(query),
                  this.prisma.grupo.count({where: query.where})
                ]);
        
                return {count: count, result: grupos}
              }
              
              const [grupos, count] = await this.prisma.$transaction([
                this.prisma.grupo.findMany({...query, take: limit}),
                this.prisma.grupo.count({where: query.where})
              ]);
        
              return {count: count, result: grupos}

        } catch (error) {
            throw new InvalidValueError("Grupo", "idCurso"); // el id no tiene los 12 bytes
        }
    }

    public async createGrupo(grupo: Grupo) {

        // to ensure uniqueness, use transaction
        try {
            return await this.prisma.$transaction(async (tx) => {

                const ultimoNro = await this.prisma.grupo.findFirst({
                    where: { cursoId: grupo.cursoId },
                    select: { numero: true },
                    orderBy: { numero: 'desc' }
                });
                let nroGrupo = 1;

                if (!!ultimoNro)
                    nroGrupo = ultimoNro.numero + 1;

                const integrantesObj = grupo.integrantes.map((id: string) => ({ id }));

                const newGrupo = await this.prisma.grupo.create({
                    data: {
                        numero: nroGrupo,
                        integrantesModel: {
                            connect: integrantesObj
                        },
                        curso: {
                            connect: { id: grupo.cursoId }
                        }
                    }
                });

                return newGrupo;
            });
        }
        catch (err) {
            throw new InvalidValueError("Grupo", "idCurso or participantes"); // el id no tiene los 12 bytes
        }

    }

    public async getGrupoById(id: string): Promise<Grupo | null> {

        try {
            return await this.prisma.grupo.findUnique({
                where: { id: id },
                include: { integrantesModel: true }
            });
            
        } catch (error) {
            throw new InvalidValueError("Grupo", "id"); // el id no tiene los 12 bytes
        }
    }
}