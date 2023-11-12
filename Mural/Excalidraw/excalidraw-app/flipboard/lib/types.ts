// error en caso de no obtener la entidad
export type Error = {
    error?: string;
}

export type Mural = {
    id: string,
    nombre: string,
    contenido: string,
    descripcion: string,
    rubricaId: string,
    cursoId: string
    rubricaModel?: any,
} & Error;

export type Usuario = {
    id: string;
    nombre: string;
    correo: string;
    cursosAlumno: string[];
    cursosDocente: string[];
    grupos: string[];
    //token?: string; // cuando hace el login, retorna el token en el body tmb
} & Error;

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
} & Error;