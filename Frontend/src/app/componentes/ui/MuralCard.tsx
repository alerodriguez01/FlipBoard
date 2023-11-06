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

  const onDelete = () => {
    alert("TODO: eliminar mural");
  };
  const onAsignarRubrica = () => {
    alert("TODO: asignar rúbrica")
  };

  return (
    <FBCard 
        title={props.title}
        editable={props.editable}
        dropDownItems={
          props.rubrica ? [{key: "delete", label: "Eliminar mural", onAction: onDelete}] :
          [{key: "asignar", label: "Asignar rúbrica", onAction: onAsignarRubrica },
          {key: "delete", label: "Eliminar mural", onAction: onDelete},]
        }
        color={props.color}
        onPress={() => router.push(`/cursos/murales/${props.muralId}`)}>
          <div title={`Rúbrica asignada: ${props.rubrica ?? "No se ha asignado rúbrica"}`} className="place-self-center">
            <RubricaIcon toggle={!!props.rubrica}/>
          </div>
          
        </FBCard>
  );
};

export { MuralCard };
