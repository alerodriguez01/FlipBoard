import React from 'react'

const EvaluarMural = ({ tipo, idMural, idCurso, idUser }: { tipo: "alumno" | "grupo", idMural: string, idCurso: string, idUser: string }) => {
    return (
        <section className='flex flex-col  gap-2 p-2'>
            Evaluar {tipo}
            <div className='p-8 border-2'>Div 1 para testear el overflow</div>
            <div className='p-8 border-2'>Div 2 para testear el overflow</div>
            <div className='p-8 border-2'>Div 3 para testear el overflow</div>
            <div className='p-8 border-2'>Div 4 para testear el overflow</div>
            <div className='p-8 border-2'>Div 5 para testear el overflow</div>
            <div className='p-8 border-2'>Div 6 para testear el overflow</div>
            <div className='p-8 border-2'>Div 7 para testear el overflow</div>
            <div className='p-8 border-2'>Div 8 para testear el overflow</div>
            <div className='p-8 border-2'>Div 9 para testear el overflow</div>
            <div className='p-8 border-2'>Div 10 para testear el overflow</div>

        </section>
    )
}

export default EvaluarMural