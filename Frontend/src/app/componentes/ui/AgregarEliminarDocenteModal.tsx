import { Usuario } from "@/lib/types"
import { toMayusFirstLetters } from "@/lib/utils"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useState } from "react"

type AgregarEliminarDocenteModalProps = {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
    onModificarDocente: (user: Usuario, estadoActual: boolean) => Promise<boolean>
    entity: any // Usuario
    estadoActual: boolean // isDocente
}

const AgregarEliminarDocenteModal = ({ isOpen, onOpenChange, onModificarDocente, estadoActual, entity }: AgregarEliminarDocenteModalProps) => {

    const [error, setError] = useState("")

    const actionTypeMay = estadoActual ? 'Eliminar' : 'Agregar'
    const actionTypeMin = estadoActual ? 'eliminar' : 'agregar'

    const onModificarDocentePress = async (onClose: () => void) => {

        const elimino = await onModificarDocente(entity, estadoActual)
        if(!elimino) setError(`No se ha podido ${actionTypeMin} el docente`)
        else onClose()

    }

    const personalizedOnOpenChange = (isOpen: boolean) => {

        // isOpen es el estado del modal cuando el usuario lo cerro (pero visualmente todav no se cerro)
        if (!isOpen) {
            // reiniciar el estado del modal si se cierra
            setError("")
        }

        // funcion del hook para cerrar el modal
        onOpenChange(isOpen)
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={personalizedOnOpenChange} classNames={{closeButton: "m-3"}}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{actionTypeMay} como docente</ModalHeader>
                        <ModalBody>
                            <p> ¿Estás seguro que deseas {actionTypeMin} como docente a <span className="italic font-semibold">{toMayusFirstLetters(entity.nombre)}</span>? </p>
                            {error !== "" && <p className="text-red-500">{error}</p>}
                            { estadoActual ? 
                                <p className="text-gray-500">Sus permisos se reducirán a los de un alumno.</p> 
                                :
                                <p className="text-gray-500">Tendrá todos los permisos que actualmente posees.</p> 
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button onPress={() => onModificarDocentePress(onClose)} className="bg-[#181e25] text-white end-2.5 dark:border dark:border-gray-700">
                                Confirmar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AgregarEliminarDocenteModal