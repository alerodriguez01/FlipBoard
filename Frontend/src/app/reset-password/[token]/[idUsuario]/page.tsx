"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react"
import { Spinner } from "@/app/componentes/ui/Spinner";
import { EyeSlashFilledIcon } from "@/app/componentes/ui/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/app/componentes/ui/icons/EyeFilledIcon"
import endpoints from "@/lib/endpoints"
import Link from "next/link"

const passSchema = z.object({
    contrasenaNueva: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/^(?=.*[A-Z])(?=.*\d).+/, "La contraseña debe tener al menos una mayúscula y un número."),
    contrasenaRepetida: z.string()
}).refine(data => data.contrasenaRepetida === data.contrasenaNueva, {
    message: "Las contraseñas deben coincidir",
    path: ["contrasenaRepetida"]
});

type PasswordForm = z.infer<typeof passSchema> & { erroresExternos?: string };
const ResetPassword = ({ params }: { params: { token: string, idUsuario: string } }) => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
        reset,
        getValues,
        setError
    } = useForm<PasswordForm>({
        resolver: zodResolver(passSchema)
    });

    const onSubmit = async (data: PasswordForm) => {

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.changePassword(params.idUsuario), {
                method: 'PUT',
                body: JSON.stringify({
                    token: params.token,
                    contrasena: data.contrasenaNueva
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 401) {
                setError("erroresExternos", { message: "Error: su sesión ha expirado, será redirigido a la página principal." });
                await new Promise((resolve) => setTimeout(resolve, 4000));
                router.replace('/');
                return;
            }
            if (!res.ok) {
                setError("erroresExternos", { message: "La contraseña seleccionada es inválida" });
                return;
            }

            setPasswordHasChanged(!passwordHasChanged);


        } catch (err) {
            setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
        }
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepetidaVisible, setIsRepetidaVisible] = useState(false);
    const [passwordHasChanged, setPasswordHasChanged] = useState(false);

    return (
        <div className="flex h-[100dvh] md:h-screen items-center">
            <aside className="hidden sm:flex justify-center flex-[2] h-full bg-white">
                <Image src="/bienvenido.png" alt="Bienvenido a FlipBoard" width={500} height={500} className="object-contain" />
            </aside>
            <main className="flex-[1] px-8 md:px-10 flex justify-center lg:items-center overflow-y-auto overflow-x-hidden h-full">

                <section className="flex flex-col items-center gap-3 p-8 border-2 border-gray-700 shadow-md dark:shadow-gray-700 rounded h-fit my-5">
                    <Image src="/flipboard-icon.png" alt="FlipBoard" width={100} height={100} />
                    <h1 className="text-xl">Reestablecer contraseña</h1>
                    {!passwordHasChanged ?
                        <>
                            <p className=" text-base text-center max-w-xs">Complete los siguientes campos para cambiar su contraseña</p>
                            <form action="" className="flex flex-col gap-3 w-full max-w-[250px]" onSubmit={handleSubmit(onSubmit)}>
                                <Input
                                    variant="bordered"
                                    type={isPasswordVisible ? "text" : "password"}
                                    label="Nueva contraseña"
                                    placeholder="********"
                                    isRequired
                                    isInvalid={!!errors.contrasenaNueva}
                                    errorMessage={errors.contrasenaNueva?.message}
                                    {...register("contrasenaNueva")}
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} tabIndex={99}>
                                            {isPasswordVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                />
                                <Input
                                    variant="bordered"
                                    type={isRepetidaVisible ? "text" : "password"}
                                    label="Confirmar contraseña"
                                    placeholder="********"
                                    isRequired
                                    isInvalid={!!errors.contrasenaRepetida} // !! -> convierte a booleano la existencia del error en la valdadacion del input
                                    errorMessage={errors.contrasenaRepetida?.message} // se isInvalid es true, se muestra el mensaje de error
                                    {...register("contrasenaRepetida")}
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={() => setIsRepetidaVisible(!isRepetidaVisible)} tabIndex={99}>
                                            {isRepetidaVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                />

                                <input type="text" className="hidden" {...register("erroresExternos")} />
                                {errors.erroresExternos &&
                                    <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>
                                }

                                <Button
                                    className="my-3 bg-blue-500 text-white rounded-md  disabled:cursor-not-allowed"
                                    isLoading={isSubmitting}
                                    type="submit"
                                    spinner={Spinner}
                                >
                                    Confirmar
                                </Button>

                            </form>
                        </>
                        :
                        <>
                            <p className="text-green-500 text-sm">Su contraseña ha sido cambiada exitosamente.</p>
                            <Link className="my-3 text-blue-500 px-3 py-1" href="/" replace>
                                Regresar a iniciar sesión
                            </Link>
                        </>
                    }
                </section>
            </main>
        </div>
    )
}

export default ResetPassword;