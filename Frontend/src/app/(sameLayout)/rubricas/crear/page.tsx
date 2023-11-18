'use client';
import { NivelCard } from "@/app/componentes/ui/NivelCard";
import { Input, Switch } from "@nextui-org/react";
import React, { useState } from "react";


export default function CrearRubrica() {

  const [niveles, setNiveles] = useState([1]);
  const [puntuable, setPuntuable] = useState(false);
  const tagClassName = "bg-white rounded-xl mt-3 mb-3 p-4 ";

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

      
      <section className={tagClassName}>
        <h2 className="text-lg font-semibold">Criterios de evaluación</h2>
      </section>

      <footer>

      </footer>
      
    </section>
  )
}