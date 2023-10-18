import { Usuario } from "@prisma/client";

export default interface UsuarioDataSource {
    createUser(user: Usuario): Promise<Usuario>;
    // ir agregando métodos restantes 
}