'use client';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup } from "@nextui-org/react";
import React from "react";
import { Spinner } from "./Spinner";
import { useTheme } from "next-themes";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import endpoints from "@/lib/endpoints";
import { RubricasAccordion } from "./RubricasAccordion";

const rubricaSchema = z.object({
  idRubrica: z.string()
});

type RubricaForm = z.infer<typeof rubricaSchema> & { erroresExternos?: string };

const AsignarRubricaModal = (props: {isOpen: boolean, onOpenChange: any, idUsuario: string, idCurso: string}) => {
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const {
    register,
    handleSubmit,
    control,
    formState: {
        errors,
        isSubmitting
    },
    setError
  } = useForm<RubricaForm>({
      resolver: zodResolver(rubricaSchema)
  });

  const onSubmit = async (onClose: Function, data: RubricaForm) => {
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.asociarRubricaAlumnos(props.idCurso), {
          method: 'PUT',
          body: JSON.stringify({
              idRubrica: data.idRubrica
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      });
      if (!res.ok) {
          setError("erroresExternos", { message: "Por favor, seleccione una rúbrica" });
          return;
      }
      
      onClose();

    } catch (err) {
        setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
    }
  };

  return (
    <Modal
          isOpen={props.isOpen}
          onOpenChange={props.onOpenChange}
          placement="center"
          size="4xl"
          classNames={{closeButton: "p-5"}} >
            <ModalContent className="min-h-[400px]">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col">
                    <h1>Asignar rúbrica</h1>
                    <h4 className="text-sm font-normal">Actividad: ......</h4>
                  </ModalHeader>
                  <form action="" onSubmit={handleSubmit((data) => onSubmit(onClose, data))}>
                    <ModalBody>
                      <Controller control={control} name='idRubrica' render={({field: {onChange, value}}) =>
                        <RadioGroup onValueChange={onChange} value={value}>
                          <RubricasAccordion searchable endpoint={endpoints.getAllRubricasFromUser(props.idUsuario)} type={"selectable"} title={"Seleccione una rúbrica"} />
                        </RadioGroup>
                      }/>
                      
                        <input type="text" className="hidden" {...register("erroresExternos")} />
                        {errors.erroresExternos &&
                          <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}
                    </ModalBody>

                    <ModalFooter className="flex flex-row">
                      <Button className="bg-[#181e25] text-white end-2.5"
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