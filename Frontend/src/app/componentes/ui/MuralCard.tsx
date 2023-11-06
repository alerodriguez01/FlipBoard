"use client"
import React from "react";
import { FBCard } from "./FBCard";
import { useRouter } from "next/navigation";
import { RubricaIcon } from "./icons/RubricaIcon";
import { Button, Tooltip } from "@nextui-org/react";
import { useTheme } from "next-themes";

type CardProps = {
  title: string,
  rubrica?: string, 
  color: number,
  editable?: boolean
  muralId: string
};

const MuralCard = (props: CardProps) => {

  const router = useRouter();

  const {theme} = useTheme()
  const currentTheme = theme === "dark" ? "dark" : "light"

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
          <Tooltip
            showArrow={false}
            placement="bottom-end"
            className="bg-gray-100 text-black"
            content={
                <article className="flex flex-row">
                  <h3 className="font-semibold mr-2">Rúbrica asignada:</h3>
                  <p>{props.rubrica ?? "No se ha asignado rúbrica"}</p>
                </article>
                
            }>
            <Button isIconOnly disableAnimation className="bg-transparent rounded-full">
                <RubricaIcon toggle={!!props.rubrica} theme={currentTheme}/>
            </Button>
        </Tooltip>
        </FBCard>
  );
};

export { MuralCard };
