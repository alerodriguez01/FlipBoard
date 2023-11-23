'use client';
import { Button,  Modal, ModalBody, ModalContent, ModalHeader, RadioGroup } from "@nextui-org/react";
import React, { useState } from "react";
import { Rubrica } from "@/lib/types";
import { RubricasAccordion } from "./RubricasAccordion";
import endpoints from "@/lib/endpoints";
import { EvaluarForm } from "./EvaluarForm";
import { toMayusFirstLetters } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean,
  onOpenChange: () => void,
  idCurso: string,
  idDocente: string,
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
      onClose={() => {setIsEvaluando(false); setRubrica(undefined);}}
      placement="center"
      size="3xl"
      classNames={{closeButton: "m-3"}} 
      className="max-h-[90%] overflow-auto">
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
                   <h4 className="font-semibold">{toMayusFirstLetters(rubrica?.nombre || "")}</h4>
                  </div>
                }
              </ModalHeader>
              
                <ModalBody className="p-3">
                  {isEvaluando && rubrica ?
                    <EvaluarForm
                      rubrica={rubrica}
                      onEvaluarSuccess={onClose}
                      onAtrasPressed={() => setIsEvaluando(false)} 
                      idDocente={props.idDocente}
                      endpoint={
                        props.entityType === "Usuario" ? 
                              endpoints.crearCalificacionAlumno(props.idCurso, props.entity.id) : 
                              endpoints.crearCalificacionGrupo(props.idCurso, props.entity.id)
                      }
                    />
                    :
                    <div className="flex flex-col gap-3">
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
                      <Button 
                        className="bg-[#181e25] text-white w-[150px] self-end end-2.5 dark:bg-gray-200 dark:text-black"
                        onPress={() => {rubrica && setIsEvaluando(true)}}
                      >Ir a evaluar</Button>
                    </div>         
                  }
                </ModalBody>
            </>
          )}

        </ModalContent>
      </Modal>
  );
}

export { EvaluarModal };