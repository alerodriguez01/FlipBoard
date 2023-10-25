import { Curso, PrismaClient } from "@prisma/client";
import CursoDataSource from "../../datasource/curso.datasource.js";
import PrismaSingleton from "./dbmanager.js";

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
            // Hubo algun error (id por ejemplo no existe o malformada)
            return null;
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
                    connect: [{id: curso.docentes[0]}]
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
        try{
            const curso = await this.prisma.curso.update({
                where: {
                    id: idCurso,
                },
                data: {
                    participantesUser: {
                        connect: {id: idUser}
                    }
                }
            });
            return curso;
        } catch(err){
            //no existe el curso o el usuario, o error de prisma
            return null;
        }
    }

    // demas metodos
}