export type Usuario = {
    id: string;
    nombre: string;
    correo: string;
    cursosAlumno: string[];
    cursosDocente: string[];
    grupos: string[];
    //token?: string; // cuando hace el login, retorna el token en el body tmb
}

export type Grupo = {
    id: string,
    numero: number,
    integrantesModel?: any
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

export type Mural = {
    id: string,
    nombre: string,
    contenido: string,
    descripcion: string,
    rubricaId: string,
    cursoId: string
    rubricaModel?: any
}

export type Nivel = {
    nombre: string,
    puntaje?: number
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
    gruposCursos: string[],
    alumnosCursos: string[],
    usuarioId: string,
    //agregar atributos requeridos
}

export type Calificacion = {
    id: string,
    valores: number[],
    observaciones?: string,
    rubricaId: string,
    rubricaModel?: Rubrica,
    grupoId?: string,
    grupoModel?: Grupo,
    usuarioId?: string,
    usuarioModel?: Usuario,
    docenteId: string,
    cursoId: string,
    muralId?: string
    muralModel?: Mural
}