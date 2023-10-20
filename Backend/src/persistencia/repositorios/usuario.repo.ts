import UsuarioDataSource from "../datasource/usuario.datasource.js";
import { UsuarioPrismaDAO } from "../prisma/dao/usuario.dao.js";
import { Usuario } from "@prisma/client";


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

    // demas metodos
}
