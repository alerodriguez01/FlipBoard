'use client';
import React from "react";
import { RubricaGrid } from "./RubricaGrid";
import { Button, Textarea } from "@nextui-org/react";
import { Rubrica } from "../lib/types";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type EvaluarProps = {
  rubrica: Rubrica,
  onEvaluarSuccess?: () => void,
  endpoint: string,
  idDocente: string
  onAtrasPressed?: () => void,
}

const EvaluarForm = (props: EvaluarProps, ref: any) => {
  
  const evaluarSchema = z.object({
    valores: z.map(z.string(), z.number(), {errorMap: () => ({message: "*Seleccione un nivel para cada criterio"})}),
    observaciones: z.string().optional()
  }).refine(data => data.valores.size === props.rubrica?.criterios.length, {message: "*Seleccione un nivel para cada criterio", path: ["valores"]});
  
  type EvaluarForm = z.infer<typeof evaluarSchema> & { erroresExternos?: string };

  const {
    register,
    control,
    handleSubmit,
    formState: {
        errors,
        isSubmitting
    },
    setError
  } = useForm<EvaluarForm>({
      resolver: zodResolver(evaluarSchema)
  });

  const onSubmit = async (data: EvaluarForm) => {
    try {
      const res = await fetch(import.meta.env.VITE_FLIPBOARD_BACKEND_URL + props.endpoint, {
          method: 'POST',
          body: JSON.stringify({
              valores: Array.from(data.valores.values()),
              observaciones: data.observaciones,
              idRubrica: props.rubrica.id,
              idDocente: props.idDocente
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!res.ok) {
          setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
          return;
      }
      
      props.onEvaluarSuccess?.();

    } catch (err) {
        setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
    }
  }

  return (
    <form className="flex flex-col" action="" onSubmit={handleSubmit((data) => onSubmit(data))}>
      <RubricaGrid
        label={props.rubrica.nombre}
        criterios={props.rubrica.criterios}
        niveles={props.rubrica.niveles}
        evaluable
        control={control}
        {...register("valores")} />
      <Textarea 
        variant="bordered"
        label="Observaciones"
        placeholder="Escriba aquí sus observaciones..."
        {...register("observaciones")}
        className="mt-3" />
      
      <footer className="flex flex-row justify-between">
        <div className="min-w-[300px] flex flex-row ml-4">
          <input type="text" className="hidden" {...register("erroresExternos")} />
          {errors.erroresExternos &&
              <p className="text-red-500 text-sm self-center">{`${errors.erroresExternos.message}`}</p>}
        </div>
        <div className="flex flex-row justify-end mt-5 gap-3">
          <Button
            onPress={props.onAtrasPressed}
            className="w-[100px]"
          >Atrás</Button>
          <Button 
            className=" text-white bg-[#6965DB] dark:bg-[#A8A5FF] dark:text-black w-[100px]"
            type='submit' 
            isLoading={isSubmitting}
          >
            Guardar
          </Button>
        </div>
      </footer>
    </form>
  )
};

export { EvaluarForm };