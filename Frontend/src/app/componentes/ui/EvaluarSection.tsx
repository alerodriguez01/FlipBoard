import React, { forwardRef, useState } from "react";
import { RubricaGrid } from "./RubricaGrid";
import { Input } from "@nextui-org/react";
import { Rubrica } from "@/lib/types";
import { useController } from "react-hook-form";

type EvaluarProps = {
  rubrica: Rubrica,
  control: any,
  name: string
}

const EvaluarSection = forwardRef( (props: EvaluarProps, ref: any) => {
  
  const {
    field,
    fieldState: {invalid, error}
  } = useController({
    name: props.name,
    control: props.control,
  });
  const [observaciones, setObservaciones] = React.useState<string|undefined>();
  const [valores, setValores] = React.useState<Map<string,number>|undefined>();

  return (
    <section>
      <RubricaGrid
        label={props.rubrica.nombre}
        criterios={props.rubrica.criterios}
        niveles={props.rubrica.niveles}
        evaluable
        dataSetter={(map: Map<string,number>) => {setValores(map); field.onChange({valores: map, observaciones})}}/>
      <Input 
        variant="bordered"
        label="Observaciones"
        placeholder="Escriba aquí sus observaciones..."
        className="px-4"
        onValueChange={(value) => {
          setObservaciones(value);
          field.onChange({valores, observaciones: value});
        }} />
        {invalid && <p>{error?.message}</p>}
    </section>
  )
});

export { EvaluarSection };