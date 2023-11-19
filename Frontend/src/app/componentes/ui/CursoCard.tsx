"use client"
import React from "react";
import { FBCard } from "./FBCard";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import CompartirCursoModal from "./CompartirCursoModal";

type CardProps = {
  title: string,
  color: number,
  editable?: boolean
  cursoId: string,
  description?: string
};

const CursoCard = (props: CardProps) => {

  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Para modal de compartir curso

  return (
    <>
      <FBCard
        title={props.title}
        description={props.description}
        editable={props.editable}
        dropDownItems={[
          { key: "share", label: "Compartir curso", onAction: onOpen },
          { key: "delete", label: "Eliminar curso", onAction: () => alert("TODO: eliminar curso") },
        ]}
        color={props.color}
        onPress={() => router.push(`/cursos/${props.cursoId}/murales`)} />

        <CompartirCursoModal isOpen={isOpen} onOpenChange={onOpenChange} cursoId={props.cursoId} cursoTitle={props.title}/>
    </>
  );
};

export { CursoCard };
