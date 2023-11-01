"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import Link from "next/link"
import { useUser } from "@/app/componentes/providers/UserProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/app/componentes/ui/EyeFilledIcon"
import { EyeSlashFilledIcon } from "@/app/componentes/ui/EyeSlashFilledIcon";
import { Spinner } from "@/app/componentes/ui/Spinner";
import ResetPassword from "./ResetPassword"

// schema para validar los datos del formulario
const userSchema = z.object({
    correo: z.string().email("El correo electrónico es invalido."),
    contrasena: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula."),
})
// tipo inferido a partir del schema
type UserSignIn = z.infer<typeof userSchema> & { erroresExternos?: string } // le agrego el atributo erroresExternos para poder mostrar errores de la API al final del formulario


const SignIn = () => {

    const { usuario, setUsuario } = useUser() // hook personalizado para manejar el usuario logueado

    const router = useRouter()

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
    } = useForm<UserSignIn>({
        resolver: zodResolver(userSchema)
    })


    const onSubmit = async (data: UserSignIn) => {

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/login', {
                body: JSON.stringify(data),
                credentials: 'include', // para que el browser guarde la cookie del JWT
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })

            if (!res.ok) {
                setError("erroresExternos", { message: "El correo y/o la contraseña son incorrectos." })
                return
            }

            const userLogged = await res.json()
            setUsuario(userLogged)
            router.push("/cursos") // redirecciono a la pagina de cursos
            // reset()
            return

        } catch (error) {
            // Por ejemplo, el backend esta caido
            setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." })
            return
        }

    }

    const [resetPassword, setResetPassword] = useState(false); // hook para renderizar solo el correo al resetear la contraseña
    const [isVisible, setIsVisible] = useState(false); // hook para mostrar/ocultar la contraseña

    if (resetPassword) return (
        // le paso el hook para que pueda volver a renderizar el formulario de login cuando termine de resetear la contraseña
        <ResetPassword renderResetPassword={setResetPassword}/> 
    )

    return (
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

            <button type="button" className="text-blue-500 text-sm" onClick={() => setResetPassword(true)}>¿Olvidaste tu contraseña?</button>

            <Button
                className="p-2 bg-blue-500 text-white rounded-md  disabled:cursor-not-allowed"
                isLoading={isSubmitting}
                type="submit"
                spinner={Spinner}
            >
                Iniciar sesión
            </Button>

        </form>
    )
}

export default SignIn