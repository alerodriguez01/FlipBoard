import { Curso, Usuario } from "@prisma/client";

type PaginatedUsers = {
    count: number,
    result: Usuario[]
}

export default interface UsuarioDataSource {
    createUsuario(user: Usuario): Promise<Usuario | null>;
    getUsuarioById(id: string): Promise<Usuario | null>;
    getUsuarioByCorreo(correo: string): Promise<Usuario | null>;
    getUsuarioByIdWithCursos(id: string): Promise<Usuario | null>;
    getUsuariosFromCursoByNombre(idCurso: string, nombre: string): Promise<PaginatedUsers | null>;
    getUsuariosFromCursoByNombrePaginated(idCurso: string, nombre: string, limit: number, offset: number): Promise<PaginatedUsers | null>;
    updateUsuarioPassword(idUsuario: string, password: string): Promise<Usuario | null>;
    loginProvider(provider: string, nombre: string, correo: string): Promise<Usuario>;
    // ir agregando métodos restantes 
}