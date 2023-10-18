import PrismaSingleton from "./dbmanager.js";

const prisma = PrismaSingleton.getInstance();

/*
    Cargar murales de un curso
*/
async function getMuralesFromCurso(idCurso: string) {

    const cursos = await prisma.mural.findMany({
        where: {
            cursoId: idCurso
        }
    })

    return cursos;

}

export { getMuralesFromCurso };