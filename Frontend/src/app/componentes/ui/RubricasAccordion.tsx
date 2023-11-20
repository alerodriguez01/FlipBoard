import { Accordion, AccordionItem, Button, Input, Radio, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { SearchIcon } from "./icons/SearchIcon";
import { useTheme } from "next-themes";
import { Rubrica } from "@/lib/types";
import { RubricaGrid } from "./RubricaGrid";
import useSWR from "swr";
import { EditIcon } from "./icons/EditIcon";
import { CrossIcon } from "./icons/CrossIcon";
import PagesHeader from "./PagesHeader";
import { toMayusFirstLetters } from "@/lib/utils";

type AccordionProps = {
    endpoint: string,
    type: 'editable' | 'selectable',
    searchable?: boolean,
    title: string,
}

const RubricasAccordion = (props: AccordionProps) => {

    const { theme } = useTheme();
    const currentTheme = theme === "dark" ? "dark" : "light";
    const [nombre, setNombre] = useState("");
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + props.endpoint + (props.searchable ? `?nombre=${nombre}` : ""),
        (url) => fetch(url).then(res => res.json()));

    if (!isLoading && data?.error) return (
        <section className="flex flex-col flex-1 p-10">
            {/* {error.message} */}
            <h1 className="">No se pudieron obtener las rúbricas</h1>
        </section>
    );

    return (
        <section className="">
            {props.searchable ?
                <PagesHeader title="Rúbricas" searchable placeholder="Buscar rúbrica" onSearch={(value: string) => setNombre(value)} />
                :
                <h1 className="font-semibold self-center p-3 pt-0">Rúbricas</h1>
            }
            {isLoading ?
                <Spinner color="primary" size="lg" className="justify-center items-center h-full" />
                :
                <Accordion variant="splitted" fullWidth>
                    {data?.map((rubric: Rubrica) => (
                        <AccordionItem
                            key={rubric.id}
                            title={
                                <div className="flex flex-row justify-between">
                                    <h1 className="self-center text-base">{toMayusFirstLetters(rubric.nombre)}</h1>
                                    {props.type === "editable" ?
                                        <div className="flex gap-3">
                                            <Button
                                                startContent={<EditIcon theme={currentTheme} />}
                                                onPress={() => alert(`TODO: MODIFICAR RUBRICA id:${rubric.id}`)}
                                            >Modificar</Button>
                                            <Button
                                                startContent={<CrossIcon />}
                                                onPress={() => alert(`TODO: ELIMINAR RUBRICA id:${rubric.id}`)}
                                            >Eliminar</Button>
                                        </div>
                                        :
                                        <Radio value={JSON.stringify(rubric)} />
                                    }
                                </div>
                            }
                            textValue={`Rubrica ${rubric.nombre}`}
                        >
                            <RubricaGrid evaluable={false} label={rubric.nombre} criterios={rubric.criterios} niveles={rubric.niveles} />
                        </AccordionItem>
                    ))}
                </Accordion>}
        </section>
    );
}

export { RubricasAccordion };