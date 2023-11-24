import { Accordion, AccordionItem, Button, Input, Radio, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Mural, Rubrica } from "@/lib/types";
import { RubricaGrid } from "./RubricaGrid";
import useSWR from "swr";
import PagesHeader from "./PagesHeader";
import endpoints from "@/lib/endpoints";
import { SearchIcon } from "./icons/SearchIcon";

type AccordionProps = {
    idCurso: string,
    onVerPressed?: (mural: Mural) => void
}

const MuralesAccordion = (props: AccordionProps) => {

    const { theme } = useTheme();
    const currentTheme = theme === "dark" ? "dark" : "light";
    const [nombre, setNombre] = useState("");
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllMuralesWithRubricas(props.idCurso) + `&nombre=${nombre}`,
        (url) => fetch(url).then(res => res.json().then(d => d.filter((m: Mural) => !!m.rubricaModel))));

    console.log(data);

    if (!isLoading && data?.error) return (
        <section className="flex flex-col flex-1 p-10">
            {/* {error.message} */}
            <h1 className="">No se pudieron obtener los murales</h1>
        </section>
    );

    return (
        <section className="flex flex-col gap-4">
            <header className="mx-2 p-4 rounded-xl shadow-md dark:shadow-gray-900 bg-white dark:bg-[#18181B]">
                <Input
                    radius="none"
                    variant="underlined"
                    size="lg"
                    className="px-2"
                    placeholder={"Buscar mural"}
                    startContent={<SearchIcon theme={currentTheme} />}
                    onValueChange={setNombre}
                />
            </header>
            {isLoading ?
                <Spinner color="primary" size="lg" className="justify-center items-center h-full" />
                :
                <>
                    {data && data.length > 0 ?
                        <Accordion variant="splitted" fullWidth>
                            {data.map((mural: Mural) => (
                                <AccordionItem
                                    key={mural.id}
                                    title={
                                        <div className="flex flex-row justify-between place-items-center">
                                            <div className="">
                                              <h1 className="text-xl font-semibold">{mural.nombre}</h1>
                                              <h2 className="text-base">Rúbrica utilizada: {mural.rubricaModel.nombre}</h2>
                                            </div>
                                            <Button onPress={() => props.onVerPressed?.(mural)}>Ver calificaciones</Button>    
                                        </div>
                                    }
                                    textValue={`Mural ${mural.nombre}`}
                                >
                                    <RubricaGrid
                                      evaluable={false}
                                      label={mural.rubricaModel?.nombre}
                                      criterios={mural.rubricaModel?.criterios}
                                      niveles={mural.rubricaModel?.niveles}
                                    />
                                </AccordionItem>
                            ))}
                        </Accordion>
                        :
                        <h1 className="px-3">No se han encontrado murales</h1>
                    }
                </>
            }
        </section>
    );
}

export { MuralesAccordion };