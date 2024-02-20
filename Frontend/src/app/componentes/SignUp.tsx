"use client"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/app/componentes/ui/icons/EyeFilledIcon"
import { EyeSlashFilledIcon } from "@/app/componentes/ui/icons/EyeSlashFilledIcon";
import { Spinner } from "@/app/componentes/ui/Spinner";
import { signIn } from "next-auth/react"
import endpoints from "@/lib/endpoints"

// schema para validar los datos del formulario
const userSchema = z.object({
    correo: z.string().email("El correo electrónico es invalido."),
    contrasena: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/^(?=.*[A-Z])(?=.*\d).+/, "La contraseña debe tener al menos una mayúscula y un número."),
    nombre: z.string().min(1, "Campo obligatorio."),
    apellido: z.string().min(1, "Campo obligatorio."),
})
// tipo inferido a partir del schema
type UserSignUp = z.infer<typeof userSchema> & { erroresExternos?: string } // le agrego el atributo erroresExternos para poder mostrar errores de la API al final del formulario


const SignIn = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/cursos"

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
    } = useForm<UserSignUp>({
        resolver: zodResolver(userSchema)
    })

    const onSubmit = async (data: UserSignUp) => {

        const body = {
            nombre: data.nombre + " " + data.apellido,
            correo: data.correo,
            contrasena: data.contrasena,
        }

        try {
            // Crea usuario
            const resCreate = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.createUser(), {
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })

            if (!resCreate.ok) {
                setError("erroresExternos", { message: "El correo ya existe." })
                return
            }

            // https://next-auth.js.org/getting-started/client#signin
            const resLogIn = await signIn("credentials", {
                correo: data.correo,
                contrasena: data.contrasena,
                redirect: false, // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
                callbackUrl: callbackUrl
            });

            if (resLogIn?.error)
                // en este punto el usuario ya se creo. Sin embargo, hubo un problema con next auth
                // se lo redirige a la pagina de inicio para que intente login, y en su defecto se le mostrara el error alli
                router.push("/")

            if (resLogIn?.ok)
                router.push(callbackUrl)
                        
            return

        } catch (error) {
            // Por ejemplo, el backend esta caido
            setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." })
            return
        }

    }


    const [isVisible, setIsVisible] = useState(false);

    return (
        <form action="" className="flex flex-col gap-3 w-full max-w-[250px]" onSubmit={handleSubmit(onSubmit)}>

            <Input
                variant="bordered"
                type="text"
                label="Nombre"
                placeholder="Juan"
                isRequired
                isInvalid={!!errors.nombre} // !! -> convierte a booleano la existencia del error en la valdadacion del input
                errorMessage={errors.nombre?.message} // se isInvalid es true, se muestra el mensaje de error
                {...register("nombre")}
            />

            <Input
                variant="bordered"
                type="text"
                label="Apellido"
                placeholder="Perez"
                isRequired
                isInvalid={!!errors.apellido} // !! -> convierte a booleano la existencia del error en la valdadacion del input
                errorMessage={errors.apellido?.message} // se isInvalid es true, se muestra el mensaje de error
                {...register("apellido")}
            />

            <Input
                variant="bordered"
                type="email"
                label="Correo electrónico"
                placeholder="flipboard@example.com"
                isRequired
                isInvalid={!!errors.correo} // !! -> convierte a booleano la existencia del error en la valdadacion del input
                errorMessage={errors.correo?.message} // se isInvalid es true, se muestra el mensaje de error
                {...register("correo")}
            />

            <Input
                variant="bordered"
                label="Contraseña"
                placeholder="********"
                isRequired
                isInvalid={!!errors.contrasena}
                errorMessage={errors.contrasena?.message}
                {...register("contrasena")}
                endContent={
                    <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                    </button>
                }
                type={isVisible ? "text" : "password"}
            />

            <input type="text" className="hidden" {...register("erroresExternos")} />
            {errors.erroresExternos &&
                <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>
            }

            <Button
                className="p-2 bg-blue-500 text-white rounded-md  disabled:cursor-not-allowed"
                isLoading={isSubmitting}
                type="submit"
                spinner={Spinner}
            >
                Registrarse
            </Button>

        </form>
    )
}

export default SignIn