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
    token: string; // cuando hace el login, retorna el token en el body tmb
};
export type Session = { 
    loggedIn: boolean,
    user?: Usuario,
};

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

export type Grupo = {
    id: string,
    numero: number,
    integrantesModel?: any
}

export type Criterio = {
    nombre: string,
    descripciones: string[]
}

export type Rubrica = {
    id: string,
    nombre: string,
    criterios: Criterio[],
    niveles: Nivel[],
    //agregar atributos requeridos
}

export type Nivel = {
    nombre: string,
    puntaje?: number
}