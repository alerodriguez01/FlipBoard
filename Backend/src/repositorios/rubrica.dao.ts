import { NotFoundError } from "../excepciones/RepoErrors.js";
import PrismaSingleton from "./dbmanager.js";

const prisma = PrismaSingleton.getInstance();

/*
    Cargar murales de un curso
*/
async function getRubricaById(id: string) {

    const rubrica = await prisma.rubrica.findUnique({
        where: {
            id: id
        }
    })

    return rubrica;
}

export { getRubricaById }