"use client"
import React from "react";
import { FBCard } from "./FBCard";
import { useRouter } from "next/navigation";
import { RubricaIcon } from "./icons/RubricaIcon";

type CardProps = {
  title: string,
  rubrica?: string, 
  color: number,
  editable?: boolean
  muralId: string
};

const MuralCard = (props: CardProps) => {

  const router = useRouter();

  return (
    <FBCard 
        title={props.title}
        editable={props.editable}
        dropDownItems={[
          {key: "asignar", label: "Asignar rúbrica", onAction: () => alert("TODO: asignar rúbrica")},
          {key: "delete", label: "Eliminar mural", onAction: () => alert("TODO: eliminar mural")}, 
          ]}
        color={props.color}
        onPress={() => router.push(`/cursos/murales/${props.muralId}`)}>
          <div title={`Rúbrica asignada: ${props.rubrica ?? "No se ha asignado rúbrica"}`} className="place-self-center">
            <RubricaIcon toggle={!!props.rubrica}/>
          </div>
          
        </FBCard>
  );
};

export { MuralCard };
