import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React, { forwardRef, useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { useController } from "react-hook-form";

type NivelProps = {
  id: string,
  puntuable?: boolean,
  onDelete?: (id: string) => void,
  control?: any,
  name?: string
};

const NivelCard = forwardRef((props: NivelProps, ref) => {

  const [nombre, setNombre] = useState("");
  const [puntaje, setPuntaje] = useState("");

  const {
    field = undefined,
    fieldState: {invalid = undefined, error = undefined}
  } = props.control && props.name ? useController({name: props.name, control: props.control}) : {fieldState: {}};

  return (
    <Card className={`max-w-[300px] ${invalid ? "border-2 border-[#e41157]":""}`}>
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
        {invalid &&
          <p className="text-[#e41157] text-sm self-start mt-1">{error?.message}</p>}
      </CardBody>
    </Card>
  )
});

export { NivelCard };