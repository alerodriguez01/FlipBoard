'use client';
import React from "react";
import { RubricaGrid } from "./RubricaGrid";
import { Button, Textarea } from "@nextui-org/react";
import { Rubrica } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + props.endpoint, {
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
        className="px-4"
        {...register("observaciones")} />
      
      <footer className="flex flex-row justify-between">
        <div className="min-w-[300px] flex flex-row ml-4">
          <input type="text" className="hidden" {...register("erroresExternos")} />
          {errors.erroresExternos &&
              <p className="text-red-500 text-sm self-center">{`${errors.erroresExternos.message}`}</p>}
        </div>
        <div className="flex flex-row justify-end mt-5 gap-3 mr-4">
          <Button
            onPress={props.onAtrasPressed}
            className="w-[100px]"
            variant="light"
          >Atrás</Button>
          <Button 
            className="bg-[#181e25] text-white dark:border dark:border-gray-700 w-[100px]"
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