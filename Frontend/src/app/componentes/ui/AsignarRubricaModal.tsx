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
import { Mural, Rubrica } from "@/lib/types";
import Link from "next/link";

const rubricaSchema = z.object({
  rubrica: z.string()
});

type RubricaForm = z.infer<typeof rubricaSchema> & { erroresExternos?: string };

type ModalProps = {
  isOpen: boolean,
  onOpenChange: any,
  idUsuario: string,
  idCurso: string,
  mode?: 'alumno' | 'mural' | 'grupo' | 'newMural',
  mural?: Mural,
  onRubricaAsignada?: () => void
  onRubricaAsignadaNewMural?: React.Dispatch<React.SetStateAction<Rubrica | null>>
};


const AsignarRubricaModal = (props:  ModalProps) => {
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const asignarEndpoint = props.mode === 'mural' ? endpoints.asociarRubricaMural(props.mural?.id ?? "") :
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

    if(props.mode === 'newMural'){
      const rubrica = JSON.parse(data.rubrica) as Rubrica;
      if(props.onRubricaAsignadaNewMural) props.onRubricaAsignadaNewMural(rubrica) // seteo la rubrica seleccionada
      onClose();
      return;
    }
    
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
      props.onRubricaAsignada?.();

    } catch (err) {
        setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
    }
  };

  return (
    <Modal
          isOpen={props.isOpen}
          onOpenChange={props.onOpenChange}
          placement="center"
          size="5xl"
          classNames={{closeButton: "m-3"}} 
          className="max-h-[90%] overflow-auto">
            <ModalContent className="">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col">
                    <h1>Asignar rúbrica</h1>
                    {props.mode === 'mural' &&
                      <div className="flex flex-row text-sm gap-2">
                        <h3 className="font-normal">Mural:</h3>
                        <h4 className="font-medium">{props.mural?.nombre}</h4>
                      </div>}
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

                    <ModalFooter className="flex flex-row justify-between">
                      <p className="self-center">Puedes crear tu rúbrica <Link href={"/rubricas/crear"} className="text-blue-500">aquí</Link></p>
                      <Button className="bg-[#181e25] text-white end-2.5 dark:border dark:border-gray-700"
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