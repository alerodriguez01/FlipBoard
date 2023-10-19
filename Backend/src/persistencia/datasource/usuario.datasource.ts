import { Usuario } from "@prisma/client";

export default interface UsuarioDataSource {
    createUsuario(user: Usuario): Promise<Usuario>;
    getUsuarioById(id: string): Promise<Usuario | null>;
    // ir agregando métodos restantes 
}