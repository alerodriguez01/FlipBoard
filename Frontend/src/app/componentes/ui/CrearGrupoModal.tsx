'use client'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { useState } from "react";
import { CrearGrupoTable } from "./CrearGrupoTable";
import { SearchIcon } from "./icons/SearchIcon";
import { useTheme } from "next-themes";
import useSWR from "swr";
import endpoints from "@/lib/endpoints";
import { Usuario } from "@/lib/types";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "./Spinner";
import { useSession } from "next-auth/react";


const CrearGrupoModal = (props: {isOpen: boolean, onOpenChange: any, idCurso: string, onCrearGrupoSuccess?: () => void, user?: Usuario}) => {
  
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const { data: session, status } = useSession();
  const [nombre, setNombre] = useState("");
  const {data: alumnosData, isLoading} = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllAlumnos(props.idCurso) + `?nombre=${nombre}`,
      (url) => fetch(url, { headers: { "Authorization": session?.user.token || "" }}).then(res => res.json()), { keepPreviousData: true });
  
  const [integrantes, setIntegrantes] = React.useState<Usuario[]>(props.user ? [props.user] : []); 

  const grupoSchema = z.object({
    integrantes: z.array(z.string(), {errorMap: () => ({message: "El grupo debe contener al menos 2 integrantes"})})
      .min(2, "El grupo debe contener al menos 2 integrantes")
  }).refine(data => props.user ? data.integrantes.includes(props.user.id) : true, "Error: no puedes crear un grupo en el que no eres participante");
  
  type GrupoForm = z.infer<typeof grupoSchema> & { erroresExternos?: string };

  const {
    control,
    handleSubmit,
    formState: {
        errors,
        isSubmitting
    },
    setError
  } = useForm<GrupoForm>({
      resolver: zodResolver(grupoSchema)
  });

  const {
    field
  } = useController({name: "integrantes", control});

  const onSubmit = async (data: GrupoForm, onClose: any) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.crearGrupo(props.idCurso), {
          method: 'POST',
          body: JSON.stringify({
              integrantes: data.integrantes
          }),
          headers: {
              'Content-Type': 'application/json',
              "Authorization": session?.user.token || ''
          }
      });

      if (!res.ok) {
          setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
          return;
      }
      
      onClose()
      props.onCrearGrupoSuccess?.();

    } catch (err) {
        setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
    }
  }

  return (
    <Modal
          isOpen={props.isOpen}
          onOpenChange={props.onOpenChange}
          onClose={() => {setIntegrantes([]); setNombre("")}}
          placement="center"
          size="2xl"
          classNames={{closeButton: "m-3"}}
          // scrollBehavior="inside"
          className="max-h-[90%] overflow-auto"
          >
            <ModalContent>
              {(onClose) => (
                <form action="" onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
                  <ModalHeader className="flex flex-col gap-1">Crear grupo</ModalHeader>
                  <ModalBody className="gap-5">
    
                    <CrearGrupoTable
                      label={"Tabla de alumnos"}
                      loadingState={isLoading}
                      title={"Buscar alumno"}
                      theme={currentTheme}
                      headerContent={
                        <Input
                          radius="none"
                          variant="underlined"
                          placeholder={'Buscar alumno'}
                          startContent={<SearchIcon theme={currentTheme}/>}
                          className="w-80"
                          onValueChange={(value) => {setNombre(value)}} />
                      }
                      searchable={true}
                      items={alumnosData?.result}
                      onActionPress={(user) => setIntegrantes((prev) => {
                          if(prev.includes(user))
                            return prev;
                          field.onChange([...prev, user].map(u => u.id));
                          return [...prev, user];
                        })
                      }
                    />
                
                    <CrearGrupoTable 
                      label={"Tabla de integrantes"} 
                      loadingState={"idle"} 
                      title={"Integrantes"}
                      theme={currentTheme} 
                      searchable={false} 
                      items={integrantes}
                      onActionPress={(user) => setIntegrantes((prev) => {
                          if(user === props.user) return prev;
                          const nuevo = prev.filter(u => u.id !== user.id);
                          field.onChange(nuevo.map(u => u.id));
                          return nuevo;
                        })
                      }
                      
                    />
                  </ModalBody>

                  <ModalFooter className="flex flex-row">
                    {(errors.erroresExternos || errors.integrantes) && 
                      <div className="flex flex-col text-red-500 text-sm justify-center">
                         <p>{errors.integrantes?.message}</p>
                         <p>{errors.erroresExternos?.message}</p>
                      </div>
                    }
                    <Button className="bg-[#181e25] text-white dark:border dark:border-gray-700 ml-auto"
                    isLoading={isSubmitting}
                      type="submit"
                      spinner={Spinner}
                    >Crear nuevo grupo</Button>
                  </ModalFooter>
                </form>
              )}

            </ModalContent>
      </Modal>
  ); 
};

export { CrearGrupoModal }