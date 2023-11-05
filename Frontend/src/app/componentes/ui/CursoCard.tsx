"use client"
import React from "react";
import { FBCard } from "./FBCard";

type CardProps = {
  title: string, 
  color: number,
  editable?: boolean
};

const CursoCard = (props: CardProps) => {
  return (
    <FBCard 
        title={props.title}
        editable={props.editable}
        dropDownItems={[
          {key: "share", label: "Compartir curso", onAction: () => alert("TODO: compartir curso")},
          {key: "delete", label: "Eliminar curso", onAction: () => alert("TODO: eliminar curso")}, 
          ]}
        color={props.color}/>
  );
};

export { CursoCard };
