'use client';
import { Input, Switch } from "@nextui-org/react";
import React from "react";


export default function CrearRubrica() {
  return (
    <section className="mt-5 mx-3 bg-white rounded-xl">
      <header className="mt-3 mx-7">
        <div className="flex flex-row justify-between">
          <Input
            size="lg"
            variant="underlined"
            className="max-w-[350px]"
            placeholder="Nombre de la rúbrica"
          />
          <Switch size="lg" className="justify-self-center">Usar puntuaciones</Switch>
        </div>
        
      </header>
      
    </section>
  )
}