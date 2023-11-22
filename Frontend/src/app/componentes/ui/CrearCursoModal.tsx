'use client'
import React from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "./Spinner";
import endpoints from "@/lib/endpoints";
import { useSession } from "next-auth/react";

const cursoSchema = z.object({
  nombre: z.string().max(50, "El nombre no puede contener más de 50 caracteres"),
  contacto: z.string().email("El correo electrónico es invalido."),
  tema: z.string(),
  sitioWeb: z.string(),
  descripcion: z.string()
});

type CursoForm = z.infer<typeof cursoSchema> & { erroresExternos?: string };


const CrearCursoModal = (props: {isOpen: boolean, onOpenChange: any, idDocente: string, onCrearCurso: Function}) => {

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

  const { data: session, status, update } = useSession();


  const onSubmit = async (onClose: Function, data: CursoForm) => {

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.createCurso(), {
          method: 'POST',
          body: JSON.stringify({
              nombre: data.nombre,
              tema: data.tema,
              sitioWeb: data.sitioWeb,
              descripcion: data.descripcion,
              emailContacto: data.contacto,
              docentes: [props.idDocente]
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      });
      console.log(res);
      if (!res.ok) {
          setError("erroresExternos", { message: "Por favor, complete los campos correspondientes" });
          return;
      }
      const curso = await res.json();
      
      // actualizo la sesion
      const cursosDocente = session?.user.cursosDocente || [];
      await update({
        ...session,
        user: {
          ...session?.user,
          cursosDocente: [...cursosDocente, curso.id] // campo a actualizar
        }
      });

      props.onCrearCurso();
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
        classNames={{closeButton: "m-3"}} >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Crear nuevo curso</ModalHeader>
                <form action="" onSubmit={handleSubmit((data) => onSubmit(onClose, data))}>
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
                      variant="bordered"
                      label="Tema"
                      placeholder="Tema del curso"
                      {...register("tema")} />
                    <Input
                      variant="bordered"
                      label="Descripción"
                      placeholder="Descripción del curso"
                      {...register("descripcion")} />
                    <Input
                      variant="bordered"
                      label="Sitio web"
                      placeholder="Sitio web del cruso" 
                      {...register("sitioWeb")} />
                    <Input
                      variant="bordered"
                      label="Contacto"
                      placeholder="Correo electrónico de contacto"
                      isRequired
                      isInvalid={!!errors.contacto}
                      errorMessage={errors.contacto?.message}
                      {...register("contacto")} />
                  </ModalBody>

                  <input type="text" className="hidden" {...register("erroresExternos")} />
                  {errors.erroresExternos &&
                      <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}

                  <ModalFooter className="flex flex-row justify-between items-center">
                    <p className="text-red-600 text-sm">* Campos obligatorios</p>
                    <Button className="bg-[#181e25] text-white dark:border dark:border-gray-700"
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