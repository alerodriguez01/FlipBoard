"use client"
import React from "react";
import { FBCard } from "./FBCard";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import CompartirCursoModal from "./CompartirCursoModal";
import EliminarModal from "./EliminarModal";

type CardProps = {
  title: string,
  color: number,
  editable?: boolean
  cursoId: string,
  description?: string,
  idUser?: string,
  mutar: Function
};

const CursoCard = (props: CardProps) => {

  const router = useRouter();
  const { isOpen: isOpenCompartir, onOpen: onOpenCompartir, onOpenChange: onOpenChangeCompartir } = useDisclosure(); // Para modal de compartir curso
  const { isOpen: isOpenEliminar, onOpen: onOpenEliminar, onOpenChange: onOpenChangeEliminar } = useDisclosure(); // Para modal de eliminar curso

  const eliminarCurso = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cursos/${props.cursoId}?docente=${props.idUser}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if(res.ok) {
      props.mutar()
      return true

    } else {
      return false
    }

  }

  return (
    <>
      <FBCard
        title={props.title}
        description={props.description}
        editable={props.editable}
        dropDownItems={[
          { key: "share", label: "Compartir curso", onAction: onOpenCompartir },
          { key: "delete", label: "Eliminar curso", onAction: onOpenEliminar },
        ]}
        color={props.color}
        onPress={() => router.push(`/cursos/${props.cursoId}/murales`)} />

        <CompartirCursoModal isOpen={isOpenCompartir} onOpenChange={onOpenChangeCompartir} cursoId={props.cursoId} cursoTitle={props.title}/>
        <EliminarModal isOpen={isOpenEliminar} onOpenChange={onOpenChangeEliminar} onEliminar={eliminarCurso} entity="curso"/>
    </>
  );
};

export { CursoCard };
