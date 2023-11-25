import { Tab, Tabs } from '@nextui-org/react'
import React, { useState } from 'react'
import { MuralesAccordion } from './MuralesAccordion'
import CalificacionesTable from './CalificacionesTable'
import { Mural, Rubrica } from '@/lib/types'
import { RubricasAccordion } from './RubricasAccordion'
import endpoints from '@/lib/endpoints'

type CalificacionesDocenteProps = {
  idCurso: string,
  idDocente: string
}

const CalificacionesDocente = (props: CalificacionesDocenteProps) => {

  const [showCalifMural, setShowCalifMural] = useState(false);
  const [mural, setMural] = React.useState<Mural | undefined>();
  const [showCalifAlumnos, setShowCalifAlumnos] = useState(false);
  const [rubricaAlumnos, setRubricaAlumnos] = React.useState<Rubrica | undefined>();
  const [showCalifGrupos, setShowCalifGrupos] = useState(false);
  const [rubricaGrupos, setRubricaGrupos] = React.useState<Rubrica | undefined>();

  return (
  <section className='flex flex-col gap-3'>
      <Tabs variant='underlined' size="lg" classNames={{base: "w-[400px]", tabList:"w-full justify-between",tab: "w-full"}}>
        <Tab key="mural" title="Mural">
          {showCalifMural ? 
            <CalificacionesTable idCurso={props.idCurso} type='mural' rubrica={mural?.rubricaModel} muralName={mural?.nombre} onRegresarPressed={() => setShowCalifMural(false)}/>
            :
            <MuralesAccordion idCurso={props.idCurso} onVerPressed={(mural) => {setMural(mural); setShowCalifMural(true);}}/>
          }
        </Tab>
        <Tab key="alumno" title="Alumno">
          { showCalifAlumnos ?
            <CalificacionesTable idCurso={props.idCurso} type='alumno' rubrica={rubricaAlumnos} onRegresarPressed={() => setShowCalifAlumnos(false)} />
            :
            <RubricasAccordion
              endpoint={endpoints.getAllRubricasIndividuales(props.idCurso)}
              type='calificable' searchable title='Rúbricas asignadas a alumnos'
              onVerPressed={(rubrica) => {setRubricaAlumnos(rubrica); setShowCalifAlumnos(true)}}
            />
          }
        </Tab>
        <Tab key="grupo" title="Grupo">
          {
            showCalifGrupos ?
              <CalificacionesTable idCurso={props.idCurso} type='grupo' rubrica={rubricaGrupos} onRegresarPressed={() => setShowCalifGrupos(false)} />
              :
              <RubricasAccordion
                endpoint={endpoints.getAllRubricasGrupales(props.idCurso)}
                type='calificable' searchable title='Rúbricas asignadas a alumnos'
                onVerPressed={(rubrica) => {setRubricaGrupos(rubrica); setShowCalifGrupos(true)}}
              />
          }
        </Tab>
      </Tabs>

    </section>
  )
}

export default CalificacionesDocente