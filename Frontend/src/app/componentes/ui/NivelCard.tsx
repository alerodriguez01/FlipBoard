import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React from "react";
import { CrossIcon } from "./icons/CrossIcon";

const NivelCard = (props: {id: number, puntuable?: boolean, onDelete?: (id: number) => void}) => {

  return (
    <Card className="max-w-[300px]" key={props.id}>
      <CardBody className="gap-3">
        <div className="flex flex-row justify-between">
          <Input 
            disabled={!props.puntuable}
            className="max-w-[100px] self-center"
            size="sm" placeholder="Puntaje" variant={props.puntuable? "underlined" : "flat"}
          />
          <Button size="sm" isIconOnly variant="light" onPress={() => props.onDelete?.(props.id)}><CrossIcon/></Button>
        </div>
        <Input placeholder="Nombre del nivel" variant="underlined" className=""/>
      </CardBody>
    </Card>
  )
}

export { NivelCard };