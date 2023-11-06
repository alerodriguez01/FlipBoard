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

function getAllMuralesWithRubricas(idCurso: string) {
    return `/api/cursos/${idCurso}/murales?rubrica=true`;
}

function createCurso() {
    return '/api/cursos'
}

// TODO: Agregar demas rutas

export default {
    agregarParticipanteACurso, changePassword,
    getUserWithCursos, getCursoById, login, createUser,
    getAllMuralesWithRubricas, createCurso
}