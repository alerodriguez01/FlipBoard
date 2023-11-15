import React from 'react'
import { AlumnosTable } from './AlumnosTable';
import { GruposTable } from './GruposTable';
import { EvaluarForm } from './EvaluarForm';
import { Rubrica } from '../lib/types';

const EvaluarMural = ({ tipo, idMural, idCurso, idUser, theme, rubrica }: { tipo: "alumno" | "grupo", idMural: string, idCurso: string, idUser: string, theme: 'light'|'dark', rubrica: Rubrica }) => {
    return (
        <section className='flex flex-col  gap-2 p-2'>
            <EvaluarForm rubrica={rubrica} endpoint={''} idDocente={''} />
        </section>
    )
}

export default EvaluarMural