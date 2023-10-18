import { getMuralesFromCurso } from "../repositorios/mural.dao.js";
import { getRubricaById } from "../repositorios/rubrica.dao.js";

type MuralWithRubricaName = {
    id: string,
    nombre: string,
    rubricaAsignada: string
}


/*
    Cargar curso con murales (id y nombre, y mural tiene que traer la rúbrica 
    asignada -solo nombre de rúbrica asignada-)
*/
async function getCursoWithMuralesAndRubrica(idCurso: string) : Promise<MuralWithRubricaName[]>{

    const murales = await getMuralesFromCurso(idCurso);

    // Cuando se utiliza map con funciones asíncronas, se obtiene un array de promesas 
    // pendientes. Para resolver esto, se usa Promise.all (espera a que todas las promesas 
    // se resuelvan antes de devolver el resultado.)
    const muralesWithRubricaName = await Promise.all(murales.map(async mural => {

        const rubrica = mural.rubricaId ? await getRubricaById(mural.rubricaId) : null ;

        return {
            id: mural.id,
            nombre: mural.nombre,
            rubricaAsignada: rubrica ? rubrica.nombre : "No asignada"
        } as MuralWithRubricaName;

    }));

    return muralesWithRubricaName;

}

export { getCursoWithMuralesAndRubrica };