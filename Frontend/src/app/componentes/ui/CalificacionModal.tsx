import { Calificacion } from '@/lib/types'
import { toMayusFirstLetters } from '@/lib/utils'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import React from 'react'
import { RubricaGrid } from './RubricaGrid'
import endpoints from '@/lib/endpoints'
import { useSession } from 'next-auth/react'

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
    Math.max(...calificacion?.rubricaModel?.niveles.map(nivel => nivel.puntaje ?? 0)) * calificacion?.rubricaModel?.criterios.length
    :
    null;

  const fecha = calificacion ? new Date(calificacion.fecha) : new Date();
  const fechaAMostrar = fecha.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: "2-digit", month: "2-digit", year: "2-digit" }) + " a las " + fecha.toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: "2-digit", minute: "2-digit" }) + " hs."

  const [downloadError, setDownloadError] = React.useState("");
  const [downloading, setDownloading] = React.useState(false);

  const { data: session, status } = useSession();

  const handleDescargar = async () => {
    setDownloadError("");
    if (!calificacion?.cursoId || !calificacion?.id) return;
    setDownloading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.downloadScreenshot(calificacion?.cursoId, calificacion?.id), {
        method: 'GET',
        headers: {
          "Authorization": session?.user.token || ''
        }
      });
      setDownloading(false);
      if (!res.ok) {
        setDownloadError("Ha ocurrido un error al descargar el contenido calificado");
        return;
      }

      const blob = await res.blob();
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'mural.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      setDownloadError("Ha ocurrido un error al descargar el contenido calificado");
    }
  }

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
                  <aside className='flex flex-col justify-between'>
                    <p><span className='font-semibold'>Fecha de calificación:</span> {fechaAMostrar}</p>
                    { calificacion?.muralId &&
                      <Button 
                        color='primary' variant='light' className='ml-auto w-fit italic p-2'
                        onPress={handleDescargar}
                        isLoading={downloading}
                      >Descargar contenido calificado</Button>
                    }
                  </aside>
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
            <ModalFooter className='flex flex-row'>
            { downloadError &&
                <p className='text-red-500 text-sm mr-4'>{downloadError}</p>
            }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CalificacionModal