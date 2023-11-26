import { Accordion, AccordionItem, Button, Input, Radio, Spinner, useDisclosure } from "@nextui-org/react";
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
import EliminarModal from "./EliminarModal";
import endpoints from "@/lib/endpoints";

type AccordionProps = {
    endpoint: string,
    type: 'editable' | 'selectable' | 'calificable',
    onVerPressed?: (rubric: Rubrica) => void,
    searchable?: boolean,
    title: string,
    userId?: string
}

const RubricasAccordion = (props: AccordionProps) => {

    const { theme } = useTheme();
    const currentTheme = theme === "dark" ? "dark" : "light";
    const [nombre, setNombre] = useState("");
    const { data, error, isLoading, mutate } = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + props.endpoint + (props.searchable ? `?nombre=${nombre}` : ""),
        (url) => fetch(url).then(res => res.json()));

    const { isOpen: isOpenEliminar, onOpen: onOpenEliminar, onOpenChange: onOpenChangeEliminar } = useDisclosure(); // Para modal de eliminar
    const [rubricaSelected, setRubricaSelected] = useState<Rubrica | null>(null);

    const onEliminarRubrica = async () => {

        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.deleteRubrica(props.userId || "", rubricaSelected?.id || ""), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (res.ok) {
            mutate();
            return true;
        }

        return false
    }

    if (!isLoading && data?.error) return (
        <section className="flex flex-col flex-1 p-10">
            {/* {error.message} */}
            <h1 className="">No se pudieron obtener las rúbricas</h1>
        </section>
    );

    return (
        <section className="">
            {props.searchable ?
                (props.type === 'calificable' ?
                <header className="mb-4 mx-2 p-4 rounded-xl shadow-md dark:shadow-gray-900 bg-white dark:bg-[#18181B]">
                    <Input
                        radius="none"
                        variant="underlined"
                        size="lg"
                        className="px-2"
                        placeholder={"Buscar rúbrica"}
                        startContent={<SearchIcon theme={currentTheme} />}
                        onValueChange={setNombre}
                    />
                </header>
                    :
                    <PagesHeader title="Rúbricas" searchable placeholder="Buscar rúbrica" onSearch={(value: string) => setNombre(value)} />
                )
                :
                <h1 className="font-semibold self-center p-3 pt-0">Rúbricas</h1>
            }
            {isLoading ?
                <Spinner color="primary" size="lg" className="justify-center items-center h-full" />
                :
                <>
                    {data && data.length > 0 ?
                        <Accordion variant="splitted" fullWidth>
                            {data.map((rubric: Rubrica) => (
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
                                                        variant="flat"
                                                        className="hidden"
                                                    >
                                                        Modificar
                                                    </Button>
                                                    <Button
                                                        startContent={<CrossIcon />}
                                                        onPress={() => { setRubricaSelected(rubric); onOpenEliminar() }}
                                                        variant="flat"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                                :
                                             props.type === 'selectable' ?
                                                <Radio value={JSON.stringify(rubric)} />
                                                :
                                                <Button variant="flat" onPress={() => props.onVerPressed?.(rubric)}>Ver calificaciones</Button>
                                            }
                                        </div>
                                    }
                                    textValue={`Rubrica ${rubric.nombre}`}
                                >
                                    <RubricaGrid evaluable={false} label={rubric.nombre} criterios={rubric.criterios} niveles={rubric.niveles} />
                                </AccordionItem>
                            ))}
                        </Accordion>
                        :
                        <h1 className="px-3">No se han encontrado rúbricas {props.type === "selectable" ? "para evaluar" : ""}</h1>
                    }
                </>
            }

            <EliminarModal isOpen={isOpenEliminar} onOpenChange={onOpenChangeEliminar} type="rubrica" entityName={toMayusFirstLetters(rubricaSelected?.nombre || "")} onEliminar={onEliminarRubrica} extraMessage="NOTA: Se eliminará la rubrica y todas las calificaciones realizadas."/>
        </section>
    );
}

export { RubricasAccordion };