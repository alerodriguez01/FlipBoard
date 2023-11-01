"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import Link from "next/link"
import { useUser } from "@/app/componentes/providers/UserProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

// schema para validar los datos del formulario
const userSchema = z.object({
    correo: z.string().email("El correo electrónico es invalido."),
    contrasena: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula."),
})
type UserSignIn = z.infer<typeof userSchema> // tipo inferido a partir del schema


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
                setError("contrasena", { message: "El correo y/o la contraseña son incorrectos." })
                return
            }

            const userLogged = await res.json()
            setUsuario(userLogged)
            // reset()
            return

        } catch (error) {
            setError("contrasena", { message: "Hubo un problema. Por favor, intente nuevamente." })
            return
        }

    }

    // Al terminar de enviar el formulario, si el usuario esta logueado, lo redirijo a la pagina de cursos
    useEffect(() => {
        if (usuario && !isSubmitting)
            router.push("/cursos")
    }, [isSubmitting])

    return (
        <form className="flex flex-col gap-3 max-w-[250px]" onSubmit={handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-1">
                <p className="text-sm">Correo electrónico</p>
                <input
                    type="email"
                    placeholder="flipboard@example.com"
                    className="p-2 border-2 border-gray-200 rounded-md"
                    {...register("correo")}
                />
            </label>
            {errors.correo &&
                <p className="text-red-500 text-sm">{`${errors.correo.message}`}</p>
            }
            <label className="flex flex-col gap-1">
                <p className="text-sm">Contraseña</p>
                <input
                    type="password"
                    className="p-2 border-2 border-gray-200 rounded-md"
                    {...register("contrasena")}
                />
            </label>
            {errors.contrasena &&
                <p className="text-red-500 text-sm">{`${errors.contrasena.message}`}</p>
            }
            <Link href="#" className="text-blue-500 text-sm">¿Olvidaste tu contraseña?</Link> { /* TODO */}
            <button
                className="p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-200 disabled:text-bold disabled:text-black disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                Iniciar sesión
            </button>
        </form>
    )
}

export default SignIn