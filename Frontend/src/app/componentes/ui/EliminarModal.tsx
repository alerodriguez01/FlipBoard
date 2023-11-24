import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useState } from "react"

type EliminarModalProps = {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
    onEliminar: () => Promise<boolean>
    entity: string
}

const EliminarModal = ({ isOpen, onOpenChange, onEliminar, entity }: EliminarModalProps) => {

    const [error, setError] = useState("")

    const onEliminarPress = async (onClose: () => void) => {

        const elimino = await onEliminar()
        if(!elimino) setError(`No se ha podido eliminar el ${entity}`)
        else onClose()

    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{closeButton: "m-3"}}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Eliminar {entity}</ModalHeader>
                        <ModalBody>
                            <p> ¿Estás seguro que deseas eliminar el {entity}? </p>
                            {error !== "" && <p className="text-red-500">{error}</p>}
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="danger" onPress={() => onEliminarPress(onClose)}>
                                Eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default EliminarModal