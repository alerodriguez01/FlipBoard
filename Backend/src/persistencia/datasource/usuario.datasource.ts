import { Usuario } from "@prisma/client";

export default interface UsuarioDataSource {
    createUsuario(user: Usuario): Promise<Usuario | null>;
    getUsuarioById(id: string): Promise<Usuario | null>;
    getUsuarioByCorreo(correo: string): Promise<Usuario | null>;
    // ir agregando métodos restantes 
}