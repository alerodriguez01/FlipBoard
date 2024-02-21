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

function loginProvider(provider: string) {
    return `/api/auth/${provider}/login`;
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

function getMuralById(idMural: string) {
    return `/api/cursos/murales/${idMural}`;
}

function getAllAlumnos(idCurso: string) {
    return `/api/cursos/${idCurso}/alumnos`;

}

function getAllGrupos(idCurso: string) {
    return `/api/cursos/${idCurso}/grupos`;
}

function getAllRubricasFromUser(idUsuario: string) {
    return `/api/usuarios/${idUsuario}/rubricas`
}

function getAllRubricasIndividuales(idCurso: string) {
    return `/api/cursos/${idCurso}/rubricas/alumnos`;
}

function getAllRubricasGrupales(idCurso: string) {
    return `/api/cursos/${idCurso}/rubricas/grupos`;
}

function asociarRubricaAlumnos(idCurso: string) {
    return `/api/cursos/${idCurso}/rubricas/alumnos`
}

function asociarRubricaGrupos(idCurso: string) {
    return `/api/cursos/${idCurso}/rubricas/grupos`
}

function crearCalificacionAlumno(idCurso: string, idAlumno: string) {
    return `/api/cursos/${idCurso}/calificaciones/alumnos/${idAlumno}`;
}

function crearCalificacionGrupo(idCurso: string, idGrupo: string) {
    return `/api/cursos/${idCurso}/calificaciones/grupos/${idGrupo}`;
}

function crearGrupo(idCurso: string) {
    return `/api/cursos/${idCurso}/grupos`;
}

function crearRubrica(idUsuario: string) {
    return `/api/usuarios/${idUsuario}/rubricas`;
}

function asociarRubricaMural(idMural: string) {
    return `/api/cursos/murales/${idMural}`;
}

function updateMural(idMural: string) {
    return `/api/cursos/murales/${idMural}`;
}

function crearMural(idCurso: string) {
    return `/api/cursos/${idCurso}/murales`;
}

function enviarEmails(idCurso: string){
    return `/api/cursos/${idCurso}/invitaciones`
}

function getCalificacionesAlumnos(idCurso: string, idAlumno: string) {
    return `/api/cursos/${idCurso}/calificaciones/alumnos/${idAlumno}`;
}

function getCalificacionesCurso(idCurso: string) {
    return `/api/cursos/${idCurso}/calificaciones/`;
}

function getCalificacionesGruposCurso(idCurso: string) {
    return `/api/cursos/${idCurso}/calificaciones/grupos`;
}

function getCalificacionesAlumnosCurso(idCurso: string) {
    return `/api/cursos/${idCurso}/calificaciones/alumnos`;
}

function deleteRubrica(idUsuario: string, idRubrica: string) {
    return `/api/usuarios/${idUsuario}/rubricas/${idRubrica}`;

}

function updateCurso(idCurso: string) {
    return `/api/cursos/${idCurso}`;
}

function downloadCalificaciones(idCurso: string) {
    return `/api/cursos/${idCurso}/calificaciones/csv`;

}

function downloadScreenshot(idCurso: string, idCalificacion: string) {
    return `/api/cursos/${idCurso}/calificaciones/${idCalificacion}/screenshot`;
}

function getAllUsuarios() {
    return '/api/usuarios'
}
// TODO: Agregar demas rutas

export default {
    agregarParticipanteACurso, changePassword,
    getUserWithCursos, getCursoById, login, createUser,
    getAllMuralesWithRubricas, createCurso, getMuralById,
    getAllAlumnos, getAllGrupos, getAllRubricasFromUser,
    asociarRubricaAlumnos, getAllRubricasIndividuales,
    getAllRubricasGrupales, crearCalificacionAlumno,
    crearCalificacionGrupo, loginProvider, crearGrupo,
    crearRubrica, asociarRubricaGrupos, asociarRubricaMural,
    crearMural, enviarEmails, getCalificacionesAlumnos,
    getCalificacionesCurso, deleteRubrica, getCalificacionesGruposCurso,
    getCalificacionesAlumnosCurso, updateCurso, updateMural, downloadCalificaciones,
    downloadScreenshot, getAllUsuarios
}
