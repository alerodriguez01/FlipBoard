'use client';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup } from "@nextui-org/react";
import React, { useState } from "react";
import { Spinner } from "./Spinner";
import { useTheme } from "next-themes";
import { RubricasCursoAccordion } from "./RubricasCursoAccordion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const rubricaSchema = z.object({
  idRubrica: z.string()
});

type RubricaForm = z.infer<typeof rubricaSchema> & { erroresExternos?: string };

const AsignarRubricaModal = (props: {isOpen: boolean, onOpenChange: any, idUsuario: string|undefined}) => {
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const {
    register,
    handleSubmit,
    formState: {
        errors,
        isSubmitting
    },
    setError
  } = useForm<RubricaForm>({
      resolver: zodResolver(rubricaSchema)
  });

  const onSubmit = async (onClose: Function, data: RubricaForm) => {
    console.log(data);
    console.log("hola");
    onClose();
  };

  return (
    <Modal
          isOpen={props.isOpen}
          onOpenChange={props.onOpenChange}
          placement="center"
          size="4xl"
          classNames={{closeButton: "p-5"}} >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col">
                    <h1>Asignar rúbrica</h1>
                    <h4 className="text-sm font-normal">Actividad: ......</h4>
                  </ModalHeader>
                  <form action="" onSubmit={handleSubmit((data) => onSubmit(onClose, data))}>
                    <ModalBody className="gap-5">
                      <RadioGroup onValueChange={(value) => {console.log(value)}} {...register("idRubrica")}>
                        <RubricasCursoAccordion idUsuario={props.idUsuario}/>
                      </RadioGroup>
                        <input type="text" className="hidden" {...register("erroresExternos")} />
                        {errors.erroresExternos &&
                          <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}
                    </ModalBody>

                    <ModalFooter className="flex flex-row justify-end">
                      <Button className="bg-[#181e25] text-white"
                      isLoading={isSubmitting}
                        type="submit"
                        spinner={Spinner}
                      >Asignar</Button>
                    </ModalFooter>
                  </form>
                </>
              )}

            </ModalContent>
      </Modal>
  ); 
}

export { AsignarRubricaModal };