import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React, { forwardRef, useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { useController } from "react-hook-form";

type NivelProps = {
  id: string,
  puntuable?: boolean,
  onDelete?: (id: string) => void,
  control: any,
  name: string
};

const NivelCard = forwardRef((props: NivelProps, ref) => {

  const [nombre, setNombre] = useState("");
  const [puntaje, setPuntaje] = useState("");

  const {
    field,
    fieldState: {invalid, error}
  } = useController({name: props.name, control: props.control, defaultValue: {nombre, puntaje: Number(puntaje)}});

  return (
    <Card className={`min-w-[300px] shadow-sm border-2 ${invalid ? "border-[#e41157]":""}`}>
      <CardBody className="gap-3">
        <div className="flex flex-row justify-between">
          <Input
            defaultValue={puntaje}
            onValueChange={value => {setPuntaje(value); field?.onChange({...field.value, puntaje: Number(value)})}} 
            disabled={!props.puntuable}
            className="max-w-[100px] self-center"
            size="sm" placeholder="Puntaje" variant={props.puntuable? "underlined" : "flat"}
          />
          <Button size="sm" isIconOnly variant="light" onPress={() => props.onDelete?.(props.id)}><CrossIcon/></Button>
        </div>
        <Input
          defaultValue={nombre}
          onValueChange={value => {setNombre(value); field?.onChange({...field.value, nombre: value})}} 
          placeholder="Nombre del nivel"
          variant="underlined"
        />
        {invalid && error?.message &&
          <p className="text-[#e41157] text-sm self-start mt-1">{error?.message}</p>}
        {invalid && (error as any)?.puntaje &&
          <p className="text-[#e41157] text-sm self-start mt-1">{(error as any)?.puntaje.message}</p>}
        {invalid && (error as any)?.nombre &&
          <p className="text-[#e41157] text-sm self-start mt-1">{(error as any)?.nombre.message}</p>}
      </CardBody>
    </Card>
  )
});

NivelCard.displayName = "NivelCard";

export { NivelCard };