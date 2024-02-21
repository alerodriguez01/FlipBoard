import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"

type ModalProps = {
    isOpen: boolean,
    onOpenChange: any,
};


const ModificarUsuarioModal = (props: ModalProps) => {
    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            placement="center"    
        >
            <ModalContent>
                <ModalHeader>

                </ModalHeader>
                <ModalBody>

                </ModalBody>
                <ModalFooter>
                    
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModificarUsuarioModal;