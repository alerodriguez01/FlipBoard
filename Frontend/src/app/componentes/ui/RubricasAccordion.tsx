import { Accordion, AccordionItem, Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { SearchIcon } from "./icons/SearchIcon";
import { useTheme } from "next-themes";
import { Rubrica } from "@/lib/types";
import { RubricaGrid } from "./RubricaGrid";
import endpoints from "@/lib/endpoints";
import useSWR from "swr";
import { EditIcon } from "./icons/EditIcon";
import { CrossIcon } from "./icons/CrossIcon";

const RubricasAccordion = (props: {userId: string}) => {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  const [nombre, setNombre] = useState("");
  const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllRubricasFromUser(props.userId) + `?nombre=${nombre}`,
      (url) => fetch(url).then(res => res.json()));
    
  if (error) return (<h1>{error.message}</h1>);
  
  return (
    <section className="m-5">
        <header className="flex flex-row justify-between mb-5">
            <h1 className="text-2xl font-semibold">Rúbricas</h1>
            <Input
            radius="none"
            variant="underlined"
            size="lg"
            placeholder={'Buscar rúbrica'}
            startContent={<SearchIcon theme={currentTheme}/>}
            className="w-[400px]"
            onValueChange={(value) => setNombre(value)} />
        </header>
        
        <Accordion variant="splitted">
            {data?.map((rubric: Rubrica) => (
            <AccordionItem 
                key={rubric.id} 
                title={
                    <div className="flex flex-row justify-between">
                        <h1 className="self-center">{rubric.nombre}</h1>
                        <div className="flex gap-3">
                            <Button 
                                startContent={<EditIcon theme={currentTheme}/>} 
                                onPress={() => alert(`TODO: MODIFICAR RUBRICA id:${rubric.id}`)}
                            >Modificar</Button>
                            <Button 
                                startContent={<CrossIcon/>}
                                onPress={() => alert(`TODO: ELIMINAR RUBRICA id:${rubric.id}`)}
                            >Eliminar</Button>
                        </div>
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

export { RubricasAccordion };