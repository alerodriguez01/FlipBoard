import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@nextui-org/react";
import { Spinner } from "@/app/componentes/ui/Spinner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

// schema para validar los datos del formulario
const userSchema = z.object({
    correo: z.string().email("El correo electrónico es invalido."),
})
// tipo inferido a partir del schema
type UserResetPassword = z.infer<typeof userSchema> & { erroresExternos?: string } // le agrego el atributo erroresExternos para poder mostrar errores de la API al final del formulario


const ResetPassword = () => {

    const {
        register, // función que retorna un objeto con los atributos requeridos para el input
        handleSubmit, // funcion que hace el preventDefault y valida los datos. Si estan correctos, ejecuta la funcion que se le pasa como parametro (pasandole los datos del formulario)
        formState: { // desestructuro nuevamente, y me quedo con los atributos que me interesan
            errors, // contiene los errores para cada input
            isSubmitting  // booleano que indica si se esta enviando el formulario (se pone en true cuando se submitea y en false cuando termina la func onSubmit)
        },
        reset, // funcion que resetea el formulario
        getValues,
        setError // funcion que permite asociar un error a un input -> setError("nombreInput", {message: "error"})
    } = useForm<UserResetPassword>({
        resolver: zodResolver(userSchema)
    })
    const { data: session, status } = useSession();

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    const [correoSent, setCorreoSent] = useState(false); // hook para renderizar "Se envio un correo a ..."

    const onSubmit = async (data: UserResetPassword) => {

        const correo = data.correo

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/reset-password', {
                body: JSON.stringify({correo}),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user.token || ""
                },
                method: 'POST'
            })

            if(!res.ok) {
                // Por ejemplo, el token para mandar el mail esta expirado
                setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." })
                return    
            }

            setCorreoSent(true)
            return

        } catch (error) {
            // Por ejemplo, el backend esta caido
            setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." })
            return
        }
    }

    return (
        <>
            <form action="" className="flex flex-col gap-3 w-full max-w-[250px]" onSubmit={handleSubmit(onSubmit)}>

                <Input
                    variant="bordered"
                    type="email"
                    label="Correo electrónico"
                    placeholder="flipboard@example.com"
                    isRequired
                    isInvalid={!!errors.correo} // !! -> convierte a booleano la existencia del error en la valdadacion del input
                    errorMessage={errors.correo?.message} // se isInvalid es true, se muestra el mensaje de error
                    {...register("correo")}
                    disabled={correoSent}
                />

                <input type="text" className="hidden" {...register("erroresExternos")} />
                {errors.erroresExternos &&
                    <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>
                }

                {correoSent &&
                    <p className="text-green-500 text-sm">Se envió un correo a {getValues("correo")}</p>
                }

                {!correoSent &&
                    <Button
                        className="p-2 bg-blue-500 text-white rounded-md  disabled:cursor-not-allowed"
                        isLoading={isSubmitting}
                        type="submit"
                        spinner={Spinner}
                        disabled={correoSent}
                    >
                        Reestablecer contraseña
                    </Button>
                }

            </form>

            <Link type="button" className="text-blue-500 text-sm" href={callbackUrl ?? "/"}>Volver</Link>
        </>
    )
}

export default ResetPassword