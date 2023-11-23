import { Calificacion } from '@/lib/types'
import { toMayusFirstLetters } from '@/lib/utils'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import React from 'react'
import { RubricaGrid } from './RubricaGrid'

type CalificacionModalProps = {
  isOpen: boolean,
  onOpenChange: () => void,
  calificacion: Calificacion | null
}

const CalificacionModal = ({ isOpen, onOpenChange, calificacion }: CalificacionModalProps) => {
  
  const nombreRubrica = toMayusFirstLetters(calificacion?.rubricaModel?.nombre || "")
  const tipo = calificacion?.muralId ? ("Mural (" + (calificacion?.grupoId ? `grupal)` : "individual)"))
    :
    calificacion?.grupoId ? `Grupal` : "Individual"

  const valoresEvaluados = new Map<string, number>();
  calificacion?.valores.forEach((valor, i) => valoresEvaluados.set(calificacion?.rubricaModel?.criterios[i].nombre || "", valor));

  const puntaje = calificacion?.rubricaModel?.niveles[0].puntaje ?
    calificacion?.rubricaModel?.criterios.reduce((accumulator, criterio, i) => accumulator + (calificacion?.rubricaModel?.niveles[calificacion.valores[i]].puntaje ?? 0), 0)
    :
    null;
  const puntajeTotal = calificacion?.rubricaModel?.niveles[0].puntaje ?
    calificacion?.rubricaModel?.criterios.reduce((acc, crit, i) => acc + (calificacion?.rubricaModel?.niveles[0].puntaje ?? 0), 0)
    :
    null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ closeButton: "m-3" }} className="max-h-[90%] overflow-auto" size="4xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className=''>Calificación</ModalHeader>
            <ModalBody>
              <section className="flex flex-col gap-2">
                <header className='flex justify-between px-3'>
                  <ul>
                    <li><span className='font-semibold'>Nombre de la rúbrica:</span> {nombreRubrica}</li>
                    <li><span className='font-semibold'>Tipo de evaluación:</span> {tipo}</li>
                    {calificacion?.muralId &&
                      <li><span className='font-semibold'>Mural:</span> {calificacion?.muralModel?.nombre}</li>
                    }
                    {calificacion?.grupoId &&
                      <li><span className='font-semibold'>Integrantes del grupo:</span> {calificacion.grupoModel?.integrantesModel?.map(integr => toMayusFirstLetters(integr.nombre)).join(", ")} (grupo {calificacion?.grupoModel?.numero})</li>
                    }
                    {puntaje && puntajeTotal && calificacion?.rubricaModel?.criterios &&
                      <li><span className='font-semibold'>Puntaje: </span>{`${(100 * puntaje / puntajeTotal).toFixed(2)}% (${puntaje}/${puntajeTotal})`}</li>
                    }
                  </ul>
                  <p><span className='font-semibold'>Fecha de calificación:</span> TODO</p>
                </header>
                <RubricaGrid
                  label={nombreRubrica}
                  criterios={calificacion?.rubricaModel?.criterios || []}
                  niveles={calificacion?.rubricaModel?.niveles || []}
                  evaluable={false}
                  valoresEvaluados={valoresEvaluados}
                />
                {calificacion?.observaciones &&
                  <Textarea
                    disabled
                    variant="bordered"
                    label="Observaciones"
                    defaultValue={calificacion?.observaciones}
                    className="px-4"
                  />
                }
              </section>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CalificacionModal