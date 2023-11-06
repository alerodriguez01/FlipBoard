function agregarParticipanteACurso(idCurso: string){
    return `/api/cursos/${idCurso}/alumnos`
}

function changePassword(idUsuario: string) {
    return `/api/usuarios/${idUsuario}/password`
}

function getUserWithCursos(idUsuario: string) {
    return `/api/usuarios/${idUsuario}?cursos=true`;
}

function getCursoById(idCurso: string) {
    return `/api/cursos/${idCurso}`;
}

function login() {
    return '/api/auth/login';
} 

function createUser() {
    return '/api/usuarios';
}

// TODO: Agregar demas rutas

export default {
    agregarParticipanteACurso, changePassword,
    getUserWithCursos, getCursoById, login, createUser
}