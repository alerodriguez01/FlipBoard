"use client"
import React from "react";
import { FBCard } from "./FBCard";
import { useRouter } from "next/navigation";

type CardProps = {
  title: string, 
  color: number,
  editable?: boolean
  cursoId: string, 
  description?: string
};

const CursoCard = (props: CardProps) => {

  const router = useRouter();

  return (
    <FBCard 
        title={props.title}
        description={props.description}
        editable={props.editable}
        dropDownItems={[
          {key: "share", label: "Compartir curso", onAction: () => alert("TODO: compartir curso")},
          {key: "delete", label: "Eliminar curso", onAction: () => alert("TODO: eliminar curso")}, 
          ]}
        color={props.color}
        onPress={() => router.push(`/cursos/${props.cursoId}/murales`)}/>
  );
};

export { CursoCard };
