import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { ReactNode } from "react";

type ModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    onConfirm?: () => void,
    message: ReactNode,
    leftFooterContent?: ReactNode,
}

const WarningModal = (props: ModalProps) => {
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} isDismissable={false}>
                
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Atención
                            </ModalHeader>
                            <ModalBody>
                                {props.message}
                            </ModalBody>
                            <ModalFooter className="flex flex-row justify-between">
                                {props.leftFooterContent}
                                <Button className="bg-[#181e25] text-white dark:border dark:border-gray-700 ml-auto"
                                 onPress={props.onConfirm}
                                > Confirmar </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
        </Modal>
    );
}

export default WarningModal;