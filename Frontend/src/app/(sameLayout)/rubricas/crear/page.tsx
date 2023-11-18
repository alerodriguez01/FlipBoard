'use client';
import { CriterioCard } from "@/app/componentes/ui/CriterioCard";
import { NivelCard } from "@/app/componentes/ui/NivelCard";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import { Button, Input, Switch } from "@nextui-org/react";
import { randomUUID } from "crypto";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import {v4} from 'uuid';

export default function CrearRubrica() {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  
  const [niveles, setNiveles] = useState([v4()]);
  const [criterios, setCriterios] = useState([v4()]);
  const [puntuable, setPuntuable] = useState(false);
  const tagClassName = "bg-white dark:bg-black rounded-xl mt-3 mb-3 p-4 ";

  return (
    <section className="m-5 flex flex-col">
      <header className={tagClassName}>
        <div className="flex flex-row justify-between">
          <Input
            size="lg"
            variant="underlined"
            className="max-w-[350px]"
            placeholder="Nombre de la rúbrica"
          />
          <Switch size="lg" className="justify-self-center" onValueChange={(isSelected) => setPuntuable(isSelected)}>Usar puntuaciones</Switch>
        </div>
      </header>
      
      <section className={tagClassName}>
        <h2 className="text-lg font-semibold mb-3">Niveles a evaluar</h2>
        {niveles.map(n => <NivelCard id={n} puntuable={puntuable}/>)}
      </section>

      <section className={tagClassName+"flex flex-col gap-3"}>
        <h2 className="text-lg font-semibold">Criterios de evaluación</h2>
        {criterios.map(c => <CriterioCard niveles={niveles} id={c} onDelete={(id) => setCriterios(prev => prev.filter(i => i != id))}/>)}
        <Button className="mt-2 self-center" isIconOnly size="sm" onPress={() => setCriterios(prev => [...prev, v4()])}>
          <PlusIcon color={currentTheme === "dark" ? "#FFFFFF" : "#000000"}/>
        </Button>
      </section>

      <Button
        className="bg-[#181e25] text-white fixed bottom-10 right-10 z-10 dark:border dark:border-gray-700"
        size="lg"> Crear rúbrica </Button>

    </section>
  )
}