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
  mutar: Function,
  onCompartirPress: (id: string, nombre: string) => void
  onEliminarPress: (id: string, nombre: string) => void
  onModificarPress: (id: string, nombre: string) => void
};

const CursoCard = (props: CardProps) => {

  const router = useRouter();

  return (
    <FBCard
      title={props.title}
      description={props.description}
      editable={props.editable}
      dropDownItems={[
        { key: "share", label: "Compartir curso", onAction: () => props.onCompartirPress(props.cursoId, props.title) },
        { key: "modify", label: "Modificar curso", onAction: () => props.onModificarPress(props.cursoId, props.title) },
        { key: "delete", label: "Eliminar curso", onAction: () => props.onEliminarPress(props.cursoId, props.title) },
      ]}
      color={props.color}
      onPress={() => router.push(`/cursos/${props.cursoId}/murales`)} />

  );
};

export { CursoCard };
