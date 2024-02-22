import UsuarioDataSource from "../datasource/usuario.datasource.js";
import { UsuarioPrismaDAO } from "../prisma/dao/usuario.dao.js";
import { Curso, Usuario } from "@prisma/client";


export class UsuarioRepository implements UsuarioDataSource {

    private static INSTANCE: UsuarioRepository;
    private usuarioDAO: UsuarioDataSource;

    private constructor() {
        this.usuarioDAO = UsuarioPrismaDAO.getInstance();
    }

    public static getInstance(): UsuarioRepository {
        if (!UsuarioRepository.INSTANCE) {
            UsuarioRepository.INSTANCE = new UsuarioRepository();
        }

        return UsuarioRepository.INSTANCE;
    }

    /*
        Crear usuario
    */
    async createUsuario(user: Usuario) {
        return await this.usuarioDAO.createUsuario(user);
    }

    /*
        Obtener usuario por id
    */
    async getUsuarioById(id: string) {
        return await this.usuarioDAO.getUsuarioById(id);
    }

    /*
        Obtener usuario por correo
    */
    async getUsuarioByCorreo(correo: string) {
        return await this.usuarioDAO.getUsuarioByCorreo(correo);
    }

    /*
        Obtener usuario por id con sus cursos
    */
    async getUsuarioByIdWithCursos(id: string) {
        return await this.usuarioDAO.getUsuarioByIdWithCursos(id);
    }

    /*
        Obtener usuarios de un curso por nombre
    */
    async getUsuariosFromCursoByNombre(idCurso: string, nombre: string) {
        return await this.usuarioDAO.getUsuariosFromCursoByNombre(idCurso, nombre);
    }

    /*
        Obtener usuarios de un curso por nombre paginado
    */
    async getUsuariosFromCursoByNombrePaginated(idCurso: string, nombre: string, limit: number, offset: number) {
        return await this.usuarioDAO.getUsuariosFromCursoByNombrePaginated(idCurso, nombre, limit, offset);
    }

    async updateUsuarioPassword(idUsuario: string, password: string) {
        return await this.usuarioDAO.updateUsuarioPassword(idUsuario, password);
    }

    async loginProvider(provider: string, nombre: string, correo: string, ): Promise<Usuario> {
        return await this.usuarioDAO.loginProvider(provider, nombre, correo);
    }

    async updateUsuario(idUsuario: string, nombre?: string, contrasena?: string, superUser?: boolean, correo?: string): Promise<Usuario> {
        return await this.usuarioDAO.updateUsuario(idUsuario, nombre, contrasena, superUser, correo);
    }

    async deleteUsuario(idUsuario: string): Promise<void> {
        return await this.usuarioDAO.deleteUsuario(idUsuario);
    }

    async getUsuariosPaginated(nombre: string, limit: number, offset: number): Promise<{count: number, result: Usuario[]} | null>{
        return await this.usuarioDAO.getUsuariosPaginated(nombre, limit, offset);
    }

}
