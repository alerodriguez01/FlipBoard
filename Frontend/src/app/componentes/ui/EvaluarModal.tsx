'use client';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup } from "@nextui-org/react";
import React, { useState } from "react";
import { Grupo, Rubrica, Usuario } from "@/lib/types";
import { RubricasAccordion } from "./RubricasAccordion";
import endpoints from "@/lib/endpoints";
import { RubricaGrid } from "./RubricaGrid";
import { EvaluarSection } from "./EvaluarSection";

type ModalProps = {
  isOpen: boolean,
  onOpenChange: () => void,
  idCurso: string
  entity: any,
  entityType: "Usuario" | "Grupo" | undefined
}

const EvaluarModal = (props: ModalProps) => {

  
  const [isEvaluando, setIsEvaluando] = useState(false);
  const [rubrica, setRubrica] = React.useState<Rubrica>();


  if(!props.entity) return <></>

  const nombreConMayus = (nom: string) => nom.split(' ').map(w => w[0].toUpperCase()+w.substring(1)).join(' ');

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      size="3xl"
      classNames={{closeButton: "p-5"}} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-2xl">Evaluar</h1>
                <div className="flex flex-row text-sm gap-2">
                  <h3 className="font-normal">Evaluando a:</h3>
                  <h4 className="font-semibold">{props.entityType === "Usuario" ? nombreConMayus(props.entity?.nombre) : `Grupo ${props.entity.numero}`}</h4>
                </div>
                {isEvaluando && 
                  <div className="flex flex-row text-sm gap-2">
                    <h3 className="font-normal">Rubrica seleccionada:</h3>
                   <h4 className="font-semibold">{rubrica?.nombre}</h4>
                  </div>
                }
              </ModalHeader>
              
              <ModalBody>
                {isEvaluando && rubrica ?
                  <EvaluarSection rubrica={rubrica}/>
                  :
                  <RadioGroup onValueChange={(value) => setRubrica(JSON.parse(value) as Rubrica)}>
                    <RubricasAccordion
                      endpoint={
                        props.entityType === "Usuario" ? 
                          endpoints.getAllRubricasIndividuales(props.idCurso) : 
                          endpoints.getAllRubricasGrupales(props.idCurso)}
                      type={"selectable"} 
                      title={"Seleccione una rúbrica"}
                    />
                  </RadioGroup>         
                }
              </ModalBody>

              <ModalFooter className="flex flex-row justify-end">
                  <Button 
                    className="bg-[#181e25] text-white end-4" 
                    onPress={isEvaluando ? () => {} : () => {rubrica && setIsEvaluando(true)}}>
                    {isEvaluando ? "Guardar" : "Ir a evaluar"}
                  </Button>
              </ModalFooter>
            </>
          )}

        </ModalContent>
      </Modal>
  );
}

export { EvaluarModal };