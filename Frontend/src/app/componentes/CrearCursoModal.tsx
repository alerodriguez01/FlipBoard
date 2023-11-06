'use client'
import React from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "./ui/Spinner";

const cursoSchema = z.object({
  nombre: z.string().max(50, "El nombre no puede contener más de 50 caracteres"),
  contacto: z.string().email("El correo electrónico es invalido."),
});

type CursoForm = z.infer<typeof cursoSchema> & { erroresExternos?: string };


const CrearCursoModal = (props: {isOpen: boolean, onOpenChange: any}) => {


    const {
      register,
      handleSubmit,
      formState: {
          errors,
          isSubmitting
      },
      setError
  } = useForm<CursoForm>({
      resolver: zodResolver(cursoSchema)
  });

  const onSubmit = async (onClose: Function) => {

  };
  

  return (
    <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="center" >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Crear nuevo curso</ModalHeader>
                <form action="" onSubmit={handleSubmit(() => onSubmit(onClose))}>
                  <ModalBody>
                    <Input
                      autoFocus
                      variant="bordered"
                      label="Nombre"
                      placeholder="Nombre del curso"
                      isRequired
                      isInvalid={!!errors.nombre}
                      errorMessage={errors.nombre?.message}
                      {...register("nombre")}/>
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
                      isRequired
                      isInvalid={!!errors.contacto}
                      errorMessage={errors.contacto?.message}
                      {...register("contacto")}/>
                  </ModalBody>

                  <input type="text" className="hidden" {...register("erroresExternos")} />
                  {errors.erroresExternos &&
                      <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}

                  <ModalFooter className="flex flex-row justify-around">
                    <p className="text-red-600 place-self-center">* Campos obligatorios</p>
                    <Button className="bg-[#181e25] text-white"
                     isLoading={isSubmitting}
                      type="submit"
                      spinner={Spinner}
                    >Crear curso</Button>
                  </ModalFooter>
                  
                  </form>
              </>
            )}

          </ModalContent>
    </Modal>
  )
}

export { CrearCursoModal };