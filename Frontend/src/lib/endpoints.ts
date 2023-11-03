function agregarParticipanteACurso(idCurso: string){
    return `/api/cursos/${idCurso}/alumnos`
}

function changePassword(idUsuario: string) {
    return `/api/usuarios/${idUsuario}/password`
}

// TODO: Agregar demas rutas

export default {
    agregarParticipanteACurso, changePassword,
}