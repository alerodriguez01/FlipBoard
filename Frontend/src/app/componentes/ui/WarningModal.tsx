import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

type ModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    onConfirm?: () => void,
}

const WarningModal = (props: ModalProps) => {
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} isDismissable={false}>
                
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                titulo
                            </ModalHeader>
                            <ModalBody>
                                <p>contenido</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={props.onConfirm}>Confirmar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
        </Modal>
    );
}

export default WarningModal;