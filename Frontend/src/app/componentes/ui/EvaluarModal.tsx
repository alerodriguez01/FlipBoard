'use client';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup } from "@nextui-org/react";
import React, { useState } from "react";
import { Grupo, Rubrica, Usuario } from "@/lib/types";
import { RubricasAccordion } from "./RubricasAccordion";
import endpoints from "@/lib/endpoints";
import { EvaluarSection } from "./EvaluarSection";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const evaluarSchema = z.object({
    data: z.object({valores: z.map(z.string(), z.string()), observaciones: z.string().optional()}, {errorMap: () => ({message: "Seleccione un nivel para cada criterio"})})
  }).refine(data => data.data.valores.size === rubrica?.criterios.length, {message: "Seleccione un nivel para cada criterio", path: ["data"]});
  
  type EvaluarForm = z.infer<typeof evaluarSchema> & { erroresExternos?: string };

  const {
    register,
    control,
    handleSubmit,
    formState: {
        errors,
        isSubmitting
    },
    setError
  } = useForm<EvaluarForm>({
      resolver: zodResolver(evaluarSchema)
  });
  
  if(!props.entity) return <></>

  const nombreConMayus = (nom: string) => nom.split(' ').map(w => w[0].toUpperCase()+w.substring(1)).join(' ');

  const onSubmit = (onClose: () => void, data: any) => {
    
  }


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
              <form action="" onSubmit={handleSubmit((data) => onSubmit(onClose, data))}>
                <ModalBody>
                  {isEvaluando && rubrica ?
                    <EvaluarSection rubrica={rubrica} control={control} {...register("data")}/>
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

                <ModalFooter className="flex flex-row justify-between">
                    <Button 
                      className="bg-[#181e25] text-white end-4"
                      type={isEvaluando ? 'submit' : 'button'} 
                      onPress={isEvaluando ? () => {} : () => {rubrica && setIsEvaluando(true)}}
                      isLoading={isSubmitting}
                    >
                      {isEvaluando ? "Guardar" : "Ir a evaluar"}
                    </Button>
                </ModalFooter>
              </form>
            </>
          )}

        </ModalContent>
      </Modal>
  );
}

export { EvaluarModal };