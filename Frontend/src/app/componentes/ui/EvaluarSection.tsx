import React, { useState } from "react";
import { RubricaGrid } from "./RubricaGrid";
import { Input } from "@nextui-org/react";
import { Rubrica } from "@/lib/types";

type EvaluarProps = {
  rubrica: Rubrica
}

const EvaluarSection = (props: EvaluarProps) => {

  const [valores, setValores] = useState();

  return (
    <section>
      <RubricaGrid
        label={props.rubrica.nombre}
        criterios={props.rubrica.criterios}
        niveles={props.rubrica.niveles}
        evaluable
        dataSetter={setValores}/>
      <Input 
        variant="bordered"
        label="Observaciones"
        placeholder="Escriba aquí sus observaciones..."
        className="px-4" />
    </section>
  )
};

export { EvaluarSection };