'use client';
import { CriterioCard } from "@/app/componentes/ui/CriterioCard";
import { NivelCard } from "@/app/componentes/ui/NivelCard";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Spinner, Switch } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from 'uuid';
import { z } from "zod";


export default function CrearRubrica() {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const { data: session, status } = useSession();
  const router = useRouter();

  const [niveles, setNiveles] = useState([v4()]);
  const [criterios, setCriterios] = useState([v4()]);
  const [puntuable, setPuntuable] = useState(false);
  const tagClassName = "bg-white dark:bg-black rounded-xl mt-3 mb-3 p-4 ";

  const rubricaSchema = z.object({
    nombre: z.string().min(1, "Este campo no puede estar vacío"),
    ...Object.fromEntries(criterios.map(c => [c,
      z.object({
        nombre: z.string().min(1, "El campo nombre no puede estar vacío"),
        descripciones: z.map(z.string(), z.string({ errorMap: () => ({ message: "Todas las descripciones deben estar completas" }) }))
          .refine(m => m.size === niveles.length, "Todas las descripciones deben estar completas")
      }, { errorMap: () => ({ message: "Las descripciones y el nombre deben estar completos" }) })
    ])),
    ...Object.fromEntries(niveles.map(n => [n,
      z.object({
        nombre: z.string().min(1, "El campo nombre no puede estar vacío"),
        puntaje: puntuable ? z.number({ errorMap: () => ({ message: "El puntaje debe ser un numero entre 1 y 100" }) })
          .min(1, "El puntaje debe ser un numero entre 1 y 100").max(100, "El puntaje debe ser un numero entre 1 y 100") : z.number().optional()
      }, { errorMap: () => ({ message: "El campo nombre no puede estar vacío" }) })
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

  if (status === 'loading' || !session?.user)
    return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

  const onSubmit = async (data: RubricaForm) => {

    const crits = Object.values(data)
      .filter((v: any) => !!v.descripciones)
      .map((c: any) => ({ nombre: c.nombre, descripciones: Array.from(c.descripciones.values()) }));
    let nivs;
    if (puntuable)
      nivs = Object.values(data)
        .filter((v: any) => !v.descripciones && !!v.nombre)
        .map((n: any) => ({ nombre: n.nombre, puntaje: n.puntaje }));
    else
      nivs = Object.values(data)
        .filter((v: any) => !v.descripciones && !!v.nombre)
        .map((n: any) => ({ nombre: n.nombre }));

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.crearRubrica(session.user.id), {
        method: 'POST',
        body: JSON.stringify({
          nombre: data.nombre,
          criterios: crits,
          niveles: nivs
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        setError("erroresExternos", { message: "Por favor, complete los campos correspondientes." });
        return;
      }

      router.replace("/rubricas");

    } catch (err) {
      setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
    }
  }

  const addNivelButton = (pos: number) => (
    <Button
      className="self-center mx-2"
      isIconOnly size="sm" variant="ghost"
      onPress={() => {
        setNiveles(prev => { prev.splice(pos, 0, v4()); return [...prev]; })
      }
      }
    >
      <PlusIcon color={currentTheme === "dark" ? "#FFFFFF" : "#000000"} />
    </Button>
  );
  let niv = 1;

  return (
    <section className={`flex flex-col p-8 overflow-auto max-w-[calc(89vw-2rem)]`}>
      <PagesHeader title="Crear rúbrica" searchable={false} />
      <form action="" className="flex flex-col" onSubmit={handleSubmit((data) => onSubmit(data))}>
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
            <Switch size="md" className="justify-self-center" onValueChange={(isSelected) => setPuntuable(isSelected)}>Usar puntuaciones</Switch>
          </div>
        </header>

        <section className={tagClassName}>
          <h2 className="text-lg font-semibold mb-3">Niveles a evaluar</h2>
          <div className="flex flex-row pb-3 overflow-auto">
            {addNivelButton(0)}
            {niveles.map(n =>
              <React.Fragment key={n}>
                <NivelCard
                  eliminable={niveles.length > 1}
                  id={n}
                  puntuable={puntuable}
                  onDelete={(id) => setNiveles(prev => prev.length === 1 ? prev : prev.filter(i => i !== id))}
                  control={control}
                  {...register(n as any)}
                />
                {addNivelButton(niv++)}
              </React.Fragment>
            )}
          </div>
        </section>

        <section className={tagClassName + `flex flex-col gap-3`}>
          <h2 className="text-lg font-semibold">Criterios de evaluación</h2>
          {criterios.map(c =>
            <CriterioCard key={c} niveles={niveles} id={c}
              onDelete={(id) => setCriterios(prev => prev.length === 1 ? prev : prev.filter(i => i != id))}
              control={control}
              {...register(c as any)}
            />)
          }
          <Button className="mt-2 self-center" variant="ghost" isIconOnly size="sm" onPress={() => setCriterios(prev => [...prev, v4()])}>
            <PlusIcon color={currentTheme === "dark" ? "#FFFFFF" : "#000000"} />
          </Button>
        </section>

        <input type="text" className="hidden" {...register("erroresExternos")} />
        {errors.erroresExternos &&
          <p className="text-red-500">{`${errors.erroresExternos.message}`}</p>}

        <Button
          className="bg-[#181e25] text-white fixed bottom-10 right-10 z-10 dark:border dark:border-gray-700"
          size="lg"
          type="submit"
          isLoading={isSubmitting}
        > Crear rúbrica </Button>

      </form>
    </section>
  )
}