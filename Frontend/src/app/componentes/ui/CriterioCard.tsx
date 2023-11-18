import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import React from "react";
import { CrossIcon } from "./icons/CrossIcon";

const CriterioCard = (props: {id: string, niveles: string[], onDelete?: (id: string) => void}) => {

  return (
    <Card>
      <CardBody>
        <header className="flex flex-row justify-between mb-3">
          <Input variant="underlined" className="max-w-[500px]" placeholder="Nombre del criterio"/>
          <Button className="self-center" size="sm" isIconOnly variant="light" onPress={() => props.onDelete?.(props.id)}><CrossIcon/></Button>
        </header>
        <div className="flex flex-row gap-3">
          {props.niveles.map(n => <Textarea placeholder="Descripción del nivel" variant="bordered" className="w-[300px]" size="sm"/>)}
        </div>
        
      </CardBody>
    </Card>
  );
}

export { CriterioCard };