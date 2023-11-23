import { Tab, Tabs } from '@nextui-org/react'
import React from 'react'

type CalificacionesDocenteProps = {
  idCurso: string,
  idDocente: string
}

const CalificacionesDocente = ({ idCurso, idDocente }: CalificacionesDocenteProps) => {
  return (
    <section className='flex flex-col'>
      <Tabs variant='underlined' classNames={{base: "w-full", cursor:'w-full', tabList:"w-full justify-between",tab: "w-full h-[50px] text-xl"}}>
        <Tab key="mural" title="Mural"/>
        <Tab key="alumno" title="Alumno"/>
        <Tab key="grupo" title="Grupo"/>
      </Tabs>
      
    </section>
  )
}

export default CalificacionesDocente