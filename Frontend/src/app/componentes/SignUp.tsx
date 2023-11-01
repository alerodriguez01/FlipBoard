"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"

const userSchema = z.object({
    correo: z.string().email(),
    contrasena: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/),
    nombre: z.string().optional(),
    apellido: z.string().optional(),
})
type User = z.infer<typeof userSchema>


const SignUp = () => {

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault() // evita que el formulario se envíe (es su comportamiento por defecto)

    }

    return (
        <form className="flex flex-col gap-3 max-w-[250px]" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
                <p className="text-sm">Nombre</p>
                <input type="text" placeholder="Juan" className="p-2 border-2 border-gray-200 rounded-md" required />
            </label>
            <label className="flex flex-col gap-1">
                <p className="text-sm">Apellido</p>
                <input type="text" placeholder="Perez" className="p-2 border-2 border-gray-200 rounded-md" required />
            </label>
            <label className="flex flex-col gap-1">
                <p className="text-sm">Correo electrónico</p>
                <input type="email" placeholder="flipboard@example.com" className="p-2 border-2 border-gray-200 rounded-md" required name="correo" />
            </label>
            <label className="flex flex-col gap-1">
                <p className="text-sm">Contraseña</p>
                <input type="password" className="p-2 border-2 border-gray-200 rounded-md" required name="contrasena" />
            </label>

            <button className="p-2 bg-blue-500 text-white rounded-md">Registrarse</button>
        </form>
    )
}

export default SignUp