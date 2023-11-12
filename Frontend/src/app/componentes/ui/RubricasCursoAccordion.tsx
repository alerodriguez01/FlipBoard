'use client';
import { Accordion, AccordionItem, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import React from "react";
import { useTheme } from "next-themes";
import { Rubrica } from "@/lib/types";
import { RubricaGrid } from "./RubricaGrid";
import endpoints from "@/lib/endpoints";
import useSWR from "swr";

const RubricasCursoAccordion = (props: {idUsuario: string|undefined}) => {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  const { data, error, isLoading } = useSWR(props.idUsuario ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllRubricasFromUser(props.idUsuario) : null,
      (url) => fetch(url).then(res => res.json()));
    
  if (error) return (<h1>{error.message}</h1>);

  if (isLoading || !props.idUsuario)
  return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />


  console.log(data);
  return (
      <section className="m-5">
          <header className="flex flex-row justify-between mb-5">
              <h1 className="text-xl font-semibold ml-2">Seleccione una rúbrica</h1>
          </header>
        
          <Accordion variant="splitted">
            {data?.map((rubric: Rubrica) => (
            <AccordionItem 
                key={rubric.id} 
                title={
                    <div className="flex flex-row justify-between">
                        <h1 className="self-center">{rubric.nombre}</h1>
                        <Radio key={rubric.id} value={rubric.id}></Radio>
                    </div>
                }
                textValue={`Rubrica ${rubric.nombre}`}
            >
                <RubricaGrid evaluable={false} label={rubric.nombre} criterios={rubric.criterios} niveles={rubric.niveles}/>
            </AccordionItem>
            ))}
          </Accordion>
        
        </section>
  );
}

export { RubricasCursoAccordion };