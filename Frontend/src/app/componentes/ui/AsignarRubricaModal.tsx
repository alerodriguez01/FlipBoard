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
  rubrica: z.string()
});

type RubricaForm = z.infer<typeof rubricaSchema> & { erroresExternos?: string };

type ModalProps = {
  isOpen: boolean,
  onOpenChange: any,
  idUsuario: string,
  idCurso: string,
  mode?: 'alumno' | 'mural' | 'grupo',
  idMural?: string
};


const AsignarRubricaModal = (props:  ModalProps) => {
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const asignarEndpoint = props.mode === 'mural' ? endpoints.asociarRubricaMural(props.idMural ?? "") :
                          props.mode === 'grupo' ? endpoints.asociarRubricaGrupos(props.idCurso) :
                          endpoints.asociarRubricaAlumnos(props.idCurso);

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
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + asignarEndpoint, {
          method: 'PUT',
          body: JSON.stringify({
              idRubrica: JSON.parse(data.rubrica).id
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
          size="3xl"
          classNames={{closeButton: "m-3"}} 
          className="max-h-[90%] overflow-auto">
            <ModalContent className="">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col">
                    <h1>Asignar rúbrica</h1>
                  </ModalHeader>
                  <form action="" onSubmit={handleSubmit((data) => onSubmit(onClose, data))}>
                    <ModalBody>
                      <Controller control={control} name='rubrica' render={({field: {onChange, value}}) =>
                        <RadioGroup onValueChange={onChange} value={value}>
                          <RubricasAccordion searchable endpoint={endpoints.getAllRubricasFromUser(props.idUsuario)} type={"selectable"} title={"Seleccione una rúbrica"} />
                        </RadioGroup>
                      }/>
                      
                        <input type="text" className="hidden" {...register("erroresExternos")} />
                        {errors.erroresExternos &&
                          <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}
                    </ModalBody>

                    <ModalFooter className="flex flex-row">
                      <Button className="bg-[#181e25] text-white end-2.5 dark:bg-gray-200 dark:text-black"
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