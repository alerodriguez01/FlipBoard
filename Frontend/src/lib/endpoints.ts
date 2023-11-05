function agregarParticipanteACurso(idCurso: string){
    return `/api/cursos/${idCurso}/alumnos`
}

function changePassword(idUsuario: string) {
    return `/api/usuarios/${idUsuario}/password`
}

function getUserWithCursos(idUsuario: string) {
    return `/api/usuarios/${idUsuario}?cursos=true`;
}

// TODO: Agregar demas rutas

export default {
    agregarParticipanteACurso, changePassword,
    getUserWithCursos
}