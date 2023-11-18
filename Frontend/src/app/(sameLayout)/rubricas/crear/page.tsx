'use client';
import { NivelCard } from "@/app/componentes/ui/NivelCard";
import { Input, Switch } from "@nextui-org/react";
import React, { useState } from "react";


export default function CrearRubrica() {

  const [niveles, setNiveles] = useState([1]);
  const [puntuable, setPuntuable] = useState(false);

  return (
    <section className="mt-5 mx-3 gap-3 bg-white rounded-xl flex flex-col">
      <header className="mt-3 mx-7">
        <div className="flex flex-row justify-between">
          <Input
            size="lg"
            variant="underlined"
            className="max-w-[350px]"
            placeholder="Nombre de la rúbrica"
          />
          <Switch size="lg" className="justify-self-center" onValueChange={(isSelected) => setPuntuable(isSelected)}>Usar puntuaciones</Switch>
        </div>
        {niveles.map(n => <NivelCard id={n} puntuable={puntuable}/>)}
      </header>
      
    </section>
  )
}