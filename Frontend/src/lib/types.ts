export type Usuario = {
    id: string;
    nombre: string;
    correo: string;
    cursosAlumno: string[];
    cursosDocente: string[];
    grupos: string[];
    //token?: string; // cuando hace el login, retorna el token en el body tmb
}

export type Curso = {
    id: string;
    nombre: string;
    tema?: string;
    sitioweb?: string;
    descripcion?: string;
    emailContacto: string;
    participantes: string[];
    docentes: string[];
    rubricasGrupos: string[];
    rubicasAlumnos: string[];
}