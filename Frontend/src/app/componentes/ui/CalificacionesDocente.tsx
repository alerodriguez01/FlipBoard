import { Tab, Tabs } from '@nextui-org/react'
import React, { useState } from 'react'
import { MuralesAccordion } from './MuralesAccordion'
import CalificacionesTable from './CalificacionesTable'
import { Mural, Rubrica } from '@/lib/types'

type CalificacionesDocenteProps = {
  idCurso: string,
  idDocente: string
}

const CalificacionesDocente = (props: CalificacionesDocenteProps) => {

  const [showCalifMural, setShowCalifMural] = useState(false);
  const [mural, setMural] = React.useState<Mural | undefined>();

  return (
  <section className='flex flex-col gap-3'>
      <Tabs variant='underlined' classNames={{base: "w-full", cursor:'w-full', tabList:"w-full justify-between",tab: "w-full h-[50px] text-xl"}}>
        <Tab key="mural" title="Mural">
          {showCalifMural ? 
            <CalificacionesTable idCurso={props.idCurso} type='mural' rubrica={mural?.rubricaModel} muralName={mural?.nombre} onRegresarPressed={() => setShowCalifMural(false)}/>
            :
            <MuralesAccordion idCurso={props.idCurso} onVerPressed={(mural) => {setMural(mural); setShowCalifMural(true);}}/>
          }
        </Tab>
        <Tab key="alumno" title="Alumno"/>
        <Tab key="grupo" title="Grupo"/>
      </Tabs>

    </section>
  )
}

export default CalificacionesDocente