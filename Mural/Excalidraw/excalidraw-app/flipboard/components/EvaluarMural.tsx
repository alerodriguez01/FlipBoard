import React from 'react'
import { AlumnosTable } from './AlumnosTable';

const EvaluarMural = ({ tipo, idMural, idCurso, idUser, theme }: { tipo: "alumno" | "grupo", idMural: string, idCurso: string, idUser: string, theme: 'light'|'dark' }) => {
    return (
        <section className='flex flex-col  gap-2 p-2'>
            <AlumnosTable
                    idCurso={idCurso} 
                    editable={false}
                    evaluable={true}
                    onEvaluarPress={(user) => {/*setEvaluarEntity(user); setEntityType('Usuario');*/}}
                    theme={theme} />
        </section>
    )
}

export default EvaluarMural