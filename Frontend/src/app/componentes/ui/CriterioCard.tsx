import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { useController } from "react-hook-form";

type CriterioProps = {
  id: string,
  niveles: string[],
  onDelete?: (id: string) => void,
  control?: any,
  name?: string
}

const CriterioCard = (props: CriterioProps) => {


  const [descripciones, setDescripciones] = useState(new Map());
  const [nombre, setNombre] = useState("");

  const {
    field = undefined,
    fieldState: {invalid = undefined, error = undefined}
  } = props.control && props.name ? useController({name: props.name, control: props.control}) : {fieldState: {}};

  useEffect(() => {
    let removed = new Map();
    props.niveles.forEach(n => removed.set(n, descripciones.get(n)));
    setDescripciones(removed);
  }, [props.niveles])

  return (
    <Card>
      <CardBody>
        <header className="flex flex-row justify-between mb-3">
          <Input defaultValue={nombre} onValueChange={value => setNombre(value)} variant="underlined" className="max-w-[500px]" placeholder="Nombre del criterio"/>
          <Button className="self-center" size="sm" isIconOnly variant="light" onPress={() => props.onDelete?.(props.id)}><CrossIcon/></Button>
        </header>
        <div className="flex flex-row gap-3">
          {props.niveles.map(n => 
            <Textarea 
              key={n}
              defaultValue={descripciones.get(n)}
              onValueChange={value => setDescripciones(prev => prev.set(n,value))} 
              placeholder="Descripción del nivel"
              variant="bordered" className="w-[300px]" size="sm"
            />)
          }
        </div>
        
      </CardBody>
    </Card>
  );
}

export { CriterioCard };