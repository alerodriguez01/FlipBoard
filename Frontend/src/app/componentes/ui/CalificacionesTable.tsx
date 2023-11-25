import endpoints from '@/lib/endpoints';
import { Calificacion, Mural, Rubrica, Usuario } from '@/lib/types';
import { toMayusFirstLetters } from '@/lib/utils';
import { Button, TableColumn, useDisclosure } from '@nextui-org/react';
import React, { Key, ReactNode, useCallback, useState } from 'react'
import { PaginatedTable } from './PaginatedTable';
import CalificacionModal from './CalificacionModal';
import { BackArrowIcon } from './icons/BackArrowIcon';
import { useTheme } from 'next-themes';

type TableProps = {
  idCurso: string,
  type: 'mural'|'alumno'|'grupo',
  rubrica?: Rubrica,
  mural?: Mural,
  onRegresarPressed?: () => void
}

const CalificacionesTable = (props: TableProps) => {

  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [calificacion, setCalificacion] = useState<Calificacion | null>(null)

  const endpoint = props.type === 'mural' ? endpoints.getCalificacionesCurso(props.idCurso) :
                   props.type === 'alumno' ? endpoints.getCalificacionesAlumnosCurso(props.idCurso) :
                   endpoints.getCalificacionesGruposCurso(props.idCurso);

  const renderCell = useCallback((calificacion: Calificacion, columnKey: Key) => {

    const nombreRubrica = toMayusFirstLetters(calificacion.rubricaModel?.nombre || "");
    
    const tipo = props.type === 'mural' ? ("Mural (" + (calificacion?.grupoId ? `grupal)` : "individual)"))
                                        : props.type === 'grupo' ? `Grupal` : "Individual"

    switch (columnKey) {
        case "nombre":
            return (
              calificacion?.grupoId ? (calificacion.grupoModel?.integrantesModel?.map((int: Usuario) => toMayusFirstLetters(int.nombre)).join(", ") + " - (" + calificacion.grupoModel?.numero + ")") 
                                    : toMayusFirstLetters(calificacion.usuarioModel?.nombre || "")
            );
        case "tipo":
            return tipo
        case "fecha":
            return "TODO"
        case "ver":
            return (
                <Button
                    className="px-3" 
                    variant='light'
                    color='primary'
                    onPress={() => {setCalificacion(calificacion ?? null); onOpen()}} >
                    Ver calificación
                </Button>
            )
    }

}, [])


  return (
    <section className="px-3">
      <PaginatedTable
          className={""}
          label={"Tabla de calificaciones"}
          idCurso={props.idCurso}
          endpoint={endpoint}
          itemType={"calificaciones"}
          renderCell={(item: Calificacion, cKey: Key) => renderCell(item, cKey)}
          searchParams={
            props.type === 'mural' ? `idMural=${props.mural?.id}&rubrica=${props.rubrica?.id}` :
                                     `rubrica=${props.rubrica?.id}`
          }
          isStriped
          headerRightContent={
            <div className='flex flex-col place-items-end justify-center'>
              {props.type === 'mural' && <h2 className='font-semibold flex flex-row gap-3'>Mural:<p className='font-normal'>{props.mural?.nombre}</p></h2>}
              <h2 className='font-semibold flex flex-row gap-3'>Rúbrica seleccionada:<p className='font-normal'>{props.rubrica?.nombre}</p></h2>
            </div>
          }
      >
        <TableColumn key="tipo" className="text-sm font-bold">Tipo de evaluación</TableColumn>
          { props.type === 'mural' ?
              <TableColumn key="nombre" className="text-sm font-bold">Nombe del alumno / Integrantes</TableColumn>
              :
            props.type === 'alumno' ?
              <TableColumn key="nombre" className="text-sm font-bold">Nombe del alumno</TableColumn>
              :
              <TableColumn key="nombre" className="text-sm font-bold">Integrantes</TableColumn>}
          <TableColumn key="fecha" className="text-sm font-bold">Fecha de calificación</TableColumn>
          <TableColumn key="ver" className="w-[100px]"> </TableColumn>
      </PaginatedTable>
      <CalificacionModal
        isOpen={isOpen} onOpenChange={onOpenChange}
        calificacion={calificacion ? {...calificacion, rubricaModel: props.rubrica} as Calificacion : null}
      />
      <Button className="mt-3" startContent={<BackArrowIcon theme={currentTheme}/>} onPress={() => props.onRegresarPressed?.()}>Regresar</Button>
    </section>
  ) 
}

export default CalificacionesTable;