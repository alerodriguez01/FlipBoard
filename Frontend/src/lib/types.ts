export type Usuario = {
    id: string;
    nombre: string;
    correo: string;
    cursosAlumno: string[];
    cursosDocente: string[];
    grupos: string[];
    //token?: string; // cuando hace el login, retorna el token en el body tmb
}