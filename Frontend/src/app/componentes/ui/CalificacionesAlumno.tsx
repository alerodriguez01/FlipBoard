import endpoints from '@/lib/endpoints';
import { Calificacion, Rubrica } from '@/lib/types';
import { toMayusFirstLetters } from '@/lib/utils';
import { Button, TableColumn, useDisclosure } from '@nextui-org/react';
import React, { Key, useCallback, useState } from 'react'
import { PaginatedTable } from './PaginatedTable';
import CalificacionModal from './CalificacionModal';
import { RubricaIcon } from './icons/RubricaIcon';

type CalificacionesAlumnoProps = {
    idCurso: string,
    idAlumno: string
}

const CalificacionesAlumno = ({ idCurso, idAlumno }: CalificacionesAlumnoProps) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [calificacion, setCalificacion] = useState<Calificacion | null>(null)

    const renderCell = useCallback((calificacion: Calificacion, columnKey: Key) => {

        const nombreRubrica = toMayusFirstLetters(calificacion.rubricaModel?.nombre || "")
        const tipo = calificacion?.muralId ? ("Mural (" + (calificacion?.grupoId ? `grupal)` : "individual)"))
            :
            calificacion?.grupoId ? `Grupal` : "Individual"

        switch (columnKey) {
            case "nombre":
                return nombreRubrica
            case "tipo":
                return tipo
            case "fecha":
                return "TODO"
            case "mural":
                return calificacion?.muralId ? calificacion?.muralModel?.nombre : "-"
            case "grupo":
                return calificacion?.grupoId ? (calificacion.grupoModel?.integrantesModel?.map(integr => toMayusFirstLetters(integr.nombre)).join(", ") + " - (" + calificacion.grupoModel?.numero + ")") : "-"
            case "ver":
                return (
                    <Button
                        className="px-3"
                        variant='light'
                        color='primary'
                        onPress={() => { setCalificacion(calificacion ?? null); onOpen() }} >
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
                idCurso={idCurso}
                endpoint={endpoints.getCalificacionesAlumnos(idCurso, idAlumno)}
                itemType={"calificaciones"}
                renderCell={(item: Calificacion, cKey: Key) => renderCell(item, cKey)}
                notHeader
                searchParams='rubrica=true'
                isStriped
            >
                <TableColumn key="nombre" className="text-sm font-bold" >Nombre de la rubrica</TableColumn>
                <TableColumn key="tipo" className="text-sm font-bold">Tipo de evaluación</TableColumn>
                <TableColumn key="mural" className="text-sm font-bold">Mural</TableColumn>
                <TableColumn key="grupo" className="text-sm font-bold">Grupo</TableColumn>
                <TableColumn key="fecha" className="text-sm font-bold">Fecha de calificación</TableColumn>
                <TableColumn key="ver" className="w-[100px]"> </TableColumn>
            </PaginatedTable>
            <CalificacionModal isOpen={isOpen} onOpenChange={onOpenChange} calificacion={calificacion} />
        </section>
    )
}

export default CalificacionesAlumno