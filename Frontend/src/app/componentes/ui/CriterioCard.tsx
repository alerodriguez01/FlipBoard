import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import React, { forwardRef, useEffect, useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { useController } from "react-hook-form";

type CriterioProps = {
  id: string,
  niveles: string[],
  onDelete?: (id: string) => void,
  control?: any,
  name?: string
}

const CriterioCard = forwardRef((props: CriterioProps, ref) => {


  const [descripciones, setDescripciones] = useState(new Map());
  const [nombre, setNombre] = useState("");

  const {
    field = undefined,
    fieldState: {invalid = undefined, error = undefined}
  } = props.control && props.name ? useController({name: props.name, control: props.control, defaultValue: {nombre, descripciones: new Map()}}) : {fieldState: {}};

  useEffect(() => {
    let removed = new Map();
    props.niveles.forEach(n => removed.set(n, descripciones.get(n)));
    setDescripciones(removed);
  }, [props.niveles])

  return (
    <Card className={invalid ? "border-2 border-[#e41157]":""}>
      <CardBody>
        <header className="flex flex-row justify-between mb-3">
          <Input 
            defaultValue={nombre}
            onValueChange={value => {setNombre(value); field?.onChange({...field.value, nombre: value});}}
            variant="underlined" className="max-w-[500px]" placeholder="Nombre del criterio"
          />
          <Button className="self-center" size="sm" isIconOnly variant="light" onPress={() => props.onDelete?.(props.id)}><CrossIcon/></Button>
        </header>
        <div className="flex flex-row gap-3">
          {props.niveles.map(n => 
            <Textarea 
              key={n}
              defaultValue={descripciones.get(n)}
              onValueChange={value => setDescripciones(prev => {
                  if(value === "") {
                    prev.delete(n);
                    field?.onChange({...field.value, descripciones: prev});
                    return prev;
                  }
                  field?.onChange({...field.value, descripciones: prev.set(n,value)});
                  return prev.set(n,value);
                })
              } 
              placeholder="Descripción del nivel"
              variant="bordered" className="w-[300px]" size="sm"
            />)
          }
        </div>
        {invalid && !!error?.message && 
          <p className="text-[#e41157] text-sm self-start mt-1">{error.message}</p>}
        {invalid && !!(error as any).nombre &&
          <p className="text-[#e41157] text-sm self-start mt-1">{(error as any).nombre.message}</p>}
        {invalid && !!(error as any).descripciones &&
          <p className="text-[#e41157] text-sm self-start mt-1">{(error as any).descripciones.message}</p>}
        {invalid && (error as any).descripciones instanceof Array &&
          <p className="text-[#e41157] text-sm self-start mt-1">
            {(error as any).descripciones.at((error as any).descripciones.length-1).value.message}
          </p>}
      </CardBody>
    </Card>
  );
});

export { CriterioCard };