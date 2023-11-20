'use client';
import { CriterioCard } from "@/app/componentes/ui/CriterioCard";
import { NivelCard } from "@/app/componentes/ui/NivelCard";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {v4} from 'uuid';
import { z } from "zod";
import errorMap from "zod/locales/en.js";



export default function CrearRubrica() {
  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  
  const [niveles, setNiveles] = useState([v4()]);
  const [criterios, setCriterios] = useState([v4()]);
  const [puntuable, setPuntuable] = useState(false);
  const tagClassName = "bg-white dark:bg-black rounded-xl mt-3 mb-3 p-4 ";

  const rubricaSchema = z.object({
    nombre: z.string().min(1, "Este campo no puede estar vacío"),
    ...Object.fromEntries(criterios.map(c => [c, 
      z.object({
        nombre: z.string().min(1, "El campo nombre no puede estar vacío"), 
        descripciones: z.map(z.string(), z.string())
                        .transform(m => m.size)
                        .pipe(z.literal(niveles.length, {errorMap: () => ({message: "Todas las descripciones deben estar completas"})}))
      }, {errorMap: () => ({message: "Las descripciones y el nombre deben estar completos"})})
    ])),
    ...Object.fromEntries(niveles.map(n => [
      n, z.object({nombre: z.string().min(1), puntaje: z.number().min(0).max(100)})
    ])),
  });
  
  type RubricaForm = z.infer<typeof rubricaSchema> & { erroresExternos?: string };

  const {
    register,
    control,
    handleSubmit,
    formState: {
        errors,
        isSubmitting
    },
    setError
  } = useForm<RubricaForm>({
    resolver: zodResolver(rubricaSchema)
  });

  const onSubmit = async (data: RubricaForm) => {
    console.log("ok",data);
  }

  const addNivelButton = (pos: number) => (
    <Button
      className="self-center mx-2"
      isIconOnly size="sm" variant="ghost"
      onPress={() => {
        setNiveles(prev => {prev.splice(pos,0,v4()); return [...prev];})}
      }
    >
      <PlusIcon color={currentTheme === "dark" ? "#FFFFFF" : "#000000"}/>
    </Button>
  );
  let niv = 1;

  return (
    <form action="" className="m-5 flex flex-col" onSubmit={handleSubmit((data) => onSubmit(data))}>
      <header className={tagClassName}>
        <div className="flex flex-row justify-between">
          <Input
            size="lg"
            variant="underlined"
            className="max-w-[350px]"
            placeholder="Nombre de la rúbrica"
            isInvalid={!!errors.nombre}
            errorMessage={errors.nombre?.message}
            {...register("nombre")}
          />
          <Switch size="lg" className="justify-self-center" onValueChange={(isSelected) => setPuntuable(isSelected)}>Usar puntuaciones</Switch>
        </div>
      </header>
      
      <section className={tagClassName}>
        <h2 className="text-lg font-semibold mb-3">Niveles a evaluar</h2>
        <div className="flex flex-row">
          {addNivelButton(0)}
          {niveles.map(n => 
            <React.Fragment key={n}>
              <NivelCard
                id={n}
                puntuable={puntuable}
                onDelete={(id) => setNiveles(prev => prev.filter(i => i !== id))}
                control={control}
                {...register(n as any)}
              />
              {addNivelButton(niv++)}
            </React.Fragment>
          )}
        </div>
      </section>

      <section className={tagClassName+"flex flex-col gap-3"}>
        <h2 className="text-lg font-semibold">Criterios de evaluación</h2>
        {criterios.map(c =>
          <CriterioCard key={c} niveles={niveles} id={c} 
            onDelete={(id) => setCriterios(prev => prev.filter(i => i != id))}
            control={control}
            {...register(c as any)}
          />)
        }
        <Button className="mt-2 self-center" variant="ghost" isIconOnly size="sm" onPress={() => setCriterios(prev => [...prev, v4()])}>
          <PlusIcon color={currentTheme === "dark" ? "#FFFFFF" : "#000000"}/>
        </Button>
      </section>

      <Button
        className="bg-[#181e25] text-white fixed bottom-10 right-10 z-10 dark:border dark:border-gray-700"
        size="lg"
        type="submit"
        onPress={() => console.log(niveles)}> Crear rúbrica </Button>

    </form>
  )
}