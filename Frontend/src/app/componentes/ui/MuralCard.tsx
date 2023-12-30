"use client"
import React from "react";
import { FBCard } from "./FBCard";
import { useRouter } from "next/navigation";
import { RubricaIcon } from "./icons/RubricaIcon";
import { Button, Tooltip } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { toMayusFirstLetters } from "@/lib/utils";

type CardProps = {
  title: string,
  rubrica?: string, 
  color: number,
  editable?: boolean
  muralId: string,
  cursoId: string,
  room: string,
  description?: string,
  onAsignarPress?: (id: string, nombre: string) => void,
  onEliminarPress?: (id: string, nombre: string) => void,
  onModificarPress?: (id: string, nombre: string) => void,
  onPress?: (redirectFun: () => void) => void
};

const MuralCard = (props: CardProps) => {

  const router = useRouter();

  const {theme} = useTheme()
  const currentTheme = theme === "dark" ? "dark" : "light"

  const handleOnPress = async () => {
    // const linkCollaborative = await generateContenidoMural()
    const redirect = () => router.push(process.env.NEXT_PUBLIC_MURAL_URL+`/?curso=${props.cursoId}&mural=${props.muralId}&theme=${currentTheme}#room=${props.room}`);
    props.onPress?.(redirect);
  }

  return (
    <FBCard 
        title={props.title}
        description={props.description}
        editable={props.editable}
        dropDownItems={
          props.rubrica ? [ {key: "modificar", label: "Modificar mural", onAction: () => props.onModificarPress?.(props.muralId, props.title)},
           {key: "delete", label: "Eliminar mural", onAction: () => props.onEliminarPress?.(props.muralId, props.title)} ] :
          [{key: "asignar", label: "Asignar rúbrica", onAction: () => props.onAsignarPress?.(props.muralId, props.title) },
          {key: "modificar", label: "Modificar mural", onAction: () => props.onModificarPress?.(props.muralId, props.title)},
          {key: "delete", label: "Eliminar mural", onAction: () => props.onEliminarPress?.(props.muralId, props.title)},]
        }
        color={props.color}
        onPress={handleOnPress}>
          <Tooltip
            showArrow={false}
            placement="bottom-end"
            className="bg-gray-100 text-black"
            content={
                <article className="flex flex-row">
                  <h3 className="font-semibold mr-2">Rúbrica asignada:</h3>
                  <p>{props.rubrica ? toMayusFirstLetters(props.rubrica) : "No se ha asignado rúbrica"}</p>
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
