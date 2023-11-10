'use client'
import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { useState } from "react";
import { Spinner } from "./Spinner";
import { CrearGrupoTable } from "./CrearGrupoTable";
import { SearchIcon } from "./icons/SearchIcon";
import { useTheme } from "next-themes";
import useSWR from "swr";
import endpoints from "@/lib/endpoints";
import { Usuario } from "@/lib/types";

const CrearGrupoModal = (props: {isOpen: boolean, onOpenChange: any, idCurso: string}) => {
  
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const [nombre, setNombre] = useState("");
  const {data: alumnosData, isLoading} = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllAlumnos(props.idCurso) + `?nombre=${nombre}`,
      (url) => fetch(url).then(res => res.json()), { keepPreviousData: true });
  
  const [integrantes, setIntegrantes] = React.useState<Usuario[]>([]); 

  return (
    <Modal
          isOpen={props.isOpen}
          onOpenChange={props.onOpenChange}
          placement="center"
          size="2xl"
          classNames={{closeButton: "p-5"}} >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Crear grupo</ModalHeader>
                  
                  <ModalBody className="gap-5">
                    <CrearGrupoTable
                      label={"Tabla de alumnos"}
                      loadingState={false}
                      title={"Buscar alumno"}
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
                      onActionPress={(user) => setIntegrantes([...integrantes, user])} />

                   
                      <CrearGrupoTable 
                        label={"Tabla de integrantes"} 
                        loadingState={"idle"} 
                        title={"Integrantes"} 
                        searchable={false} 
                        items={integrantes}
                        onActionPress={(user) => setIntegrantes(integrantes.filter(u => u.id !== user.id))}/>
                  </ModalBody>

                  <ModalFooter className="flex flex-row justify-end">
                    <Button className="bg-[#181e25] text-white"
                    isLoading={false}
                      type="submit"
                      spinner={Spinner}
                    >Crear nuevo grupo</Button>
                  </ModalFooter>
                </>
              )}

            </ModalContent>
      </Modal>
  ); 
};

export { CrearGrupoModal }