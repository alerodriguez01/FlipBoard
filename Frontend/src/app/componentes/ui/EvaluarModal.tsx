import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, usePagination } from "@nextui-org/react";
import React from "react";
import { Spinner } from "./Spinner";
import { Grupo, Usuario } from "@/lib/types";

const EvaluarModal = (props: {isOpen: boolean, onOpenChange: () => void, entity: Usuario | Grupo | undefined}) => {
  
  const {activePage, range, setPage, onNext, onPrevious} = usePagination({
    total: 2,
    showControls: false
  });
  
  if(!props.entity) return <></>

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      size="2xl"
      classNames={{closeButton: "p-5"}} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Evaluar</ModalHeader>
              
              <ModalBody className="gap-5">
                
              </ModalBody>

              <ModalFooter className="flex flex-row justify-end">
                <Button className="bg-[#181e25] text-white"
                isLoading={false}
                  type="submit"
                  spinner={Spinner}
                >Ir a evaluar</Button>
              </ModalFooter>
            </>
          )}

        </ModalContent>
      </Modal>
  );
}

export { EvaluarModal };