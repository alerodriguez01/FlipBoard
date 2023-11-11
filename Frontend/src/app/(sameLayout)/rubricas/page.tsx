'use client';
import { RubricaGrid } from "@/app/componentes/ui/RubricaGrid";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import { SearchIcon } from "@/app/componentes/ui/icons/SearchIcon";
import endpoints from "@/lib/endpoints";
import { Rubrica } from "@/lib/types";
import { Accordion, AccordionItem, Button, Divider, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import useSWR from "swr";

export default function Rubricas() {

    const {theme} = useTheme();
    const currentTheme = theme === "dark" ? "dark" : "light";
    const { data: session, status } = useSession();
    const { data, error, isLoading } = useSWR(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllRubricasFromUser(session.user.id) : null,
        (url) => fetch(url).then(res => res.json()));

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
                className="w-[400px]" />
            </header>
            
            <Accordion variant="splitted">
                {data?.map((rubric: Rubrica) => (
                <AccordionItem 
                    key={rubric.id} 
                    title={
                        <div className="flex flex-row justify-between">
                            <h1 className="self-center">{rubric.nombre}</h1>
                            <div className="flex gap-3">
                                <Button className="">Modificar</Button>
                                <Button>Eliminar</Button>
                            </div>
                        </div>
                    }
                    textValue={`Rubrica ${rubric.nombre}`}
                >
                    <RubricaGrid evaluable={false} label={rubric.nombre} criterios={rubric.criterios} niveles={rubric.niveles}/>
                </AccordionItem>
                ))}
            </Accordion>

            <Button
                className="bg-[#181e25] text-white fixed bottom-10 right-10"
                startContent={<PlusIcon color="#FFFFFF" />}
                size="lg"
                onPress={() => {alert("TODO: CREAR NUEVA RUBRICA")}}> Crear nueva rúbrica </Button>
        </section>
    )
}