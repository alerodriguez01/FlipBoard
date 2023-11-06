import React from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";


const CrearCursoModal = (props: {isOpen: boolean, onOpenChange: any}) => {
  return (
    <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="center" >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Crear nuevo curso</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    variant="bordered"
                    label="Nombre"
                    placeholder="Nombre del curso"
                    isRequired/>
                    <Input
                    autoFocus
                    variant="bordered"
                    label="Tema"
                    placeholder="Tema del curso" />
                    <Input
                    autoFocus
                    variant="bordered"
                    label="Descripción"
                    placeholder="Descripción del curso" />
                    <Input
                    autoFocus
                    variant="bordered"
                    label="Sitio web"
                    placeholder="Sitio web del cruso" />
                    <Input
                    autoFocus
                    variant="bordered"
                    label="Contacto"
                    placeholder="Correo electrónico de contacto"
                    isRequired />
                </ModalBody>
                <ModalFooter className="flex flex-row justify-around">
                  <p className="text-red-600 place-self-center">* Campos obligatorios</p>
                  <Button className="bg-[#181e25] text-white">Crear curso</Button>
                </ModalFooter>
              </>
            )}

          </ModalContent>
      </Modal>
  )
}

export { CrearCursoModal };