import UsuarioDataSource from "./datasource/usuario.datasource.js";
import { UsuarioPrismaDAO } from "../daos/prisma/usuario.dao.js";
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
    async createUser(user: Usuario) {
        return await this.usuarioDAO.createUser(user);
    }

    // demas metodos
}
