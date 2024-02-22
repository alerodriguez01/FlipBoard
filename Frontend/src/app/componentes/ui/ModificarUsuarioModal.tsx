import { Usuario } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch } from "@nextui-org/react"
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import { Spinner } from "./Spinner";
import endpoints from "@/lib/endpoints";
import { useEffect } from "react";
import { getCorreoFromProvider, toMayusFirstLetters } from "@/lib/utils";

type ModalProps = {
    isOpen: boolean,
    onOpenChange: any,
    user: Usuario,
    showExtraFields?: boolean,
    sessionUser: Usuario,
    onUsuarioModificado?: (userData: {correo: string, nombre: string}) => void
};

const userSchema = z.object({
    correo: z.string().email("El correo electrónico es invalido."),
    contrasena: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/^(?=.*[A-Z])(?=.*\d).+/, "La contraseña debe tener al menos una mayúscula y un número.")
        .or(z.string().length(0)),
    nombre: z.string()
        .min(1, "Campo obligatorio.")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras."),
    superUser: z.boolean().or(z.undefined())
});

type UserForm = z.infer<typeof userSchema> & { erroresExternos?: string };

const ModificarUsuarioModal = (props: ModalProps) => {

    const {
        register,
        control,
        handleSubmit,
        setError,
        setValue,
        formState: {
          errors,
          isSubmitting
        },
    } = useForm<UserForm>({
        resolver: zodResolver(userSchema)
    });

    useEffect(() => {
        setValue("nombre", toMayusFirstLetters(props.user.nombre));
        setValue("correo", getCorreoFromProvider(props.user.correo));
        setValue("contrasena", "");
        setValue("superUser", props.user.superUser);
    }, [props.user]);

    const onSubmit = async (onClose: () => void, data: UserForm) => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.updateUsuario(props.user.id), {
              method: 'PATCH',
              body: JSON.stringify({
                nombre: data.nombre,
                correo: data.correo,
                contrasena: data.contrasena,
                superUser: data.superUser ?? false
              }),
              headers: {
                'Content-Type': 'application/json',
                "Authorization": props.sessionUser.token || ''
              }
            });

            if (!res.ok) {
              setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
              return;
            }
            
            props.onUsuarioModificado?.({correo: data.correo, nombre: data.nombre});
            onClose();
      
          } catch (err) {
            setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." });
          }
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            placement="center"
            classNames={{ closeButton: "m-3"}}
        >
            <ModalContent>
                { (onClose) => (
                    <>
                        <ModalHeader className="flex flex-col">
                            Modificar usuario
                            {props.showExtraFields && 
                                <h1 className='text-xs font-normal'><span className='font-semibold'>ID:</span> {props.user.id}</h1>}
                        </ModalHeader>
                        <form onSubmit={handleSubmit((data) => onSubmit(onClose, data))}>
                            <ModalBody className="flex flex-col justify-center">
                                <Input
                                    variant="bordered"
                                    label="Nombre"
                                    isRequired
                                    isInvalid={!!errors.nombre}
                                    errorMessage={errors.nombre?.message}
                                    defaultValue={toMayusFirstLetters(props.user.nombre)}
                                    {...register("nombre")}
                                />
                                <Input
                                    variant="bordered"
                                    label="Correo"
                                    isRequired
                                    isInvalid={!!errors.correo}
                                    isDisabled={!!props.user.correo.startsWith("google|")}
                                    errorMessage={errors.correo?.message}
                                    defaultValue={getCorreoFromProvider(props.user.correo)}
                                    {...register("correo")}
                                />
                                <Input
                                    variant="bordered"
                                    label="Nueva contraseña"
                                    isInvalid={!!errors.contrasena}
                                    isDisabled={!!props.user.correo.startsWith("google|")}
                                    errorMessage={errors.contrasena?.message}
                                    {...register("contrasena")}
                                />
                                {props.user.correo.startsWith("google|") &&
                                    <p className="text-sm text-start text-gray-400">El correo y contraseña de cuentas creadas con Google no pueden modificarse.</p>}
                                <input type="text" className="hidden"  {...register("erroresExternos")}/>
                                {errors.erroresExternos &&
                                    <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}
                            </ModalBody>
                            
                            <ModalFooter className="flex flex-row justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    {props.showExtraFields && 
                                        <Controller
                                            control={control}
                                            name="superUser"
                                            defaultValue={!!props.user.superUser}
                                            render={({ field }) => (
                                                <Switch
                                                    size="sm"
                                                    isSelected={field.value}
                                                    onChange={field.onChange}
                                                    isDisabled={props.user.id === props.sessionUser.id}
                                                >Administrador</Switch>
                                            )}
                                        />
                                    }
                                    <p className="text-red-600 text-sm">* Campos obligatorios</p>
                                </div>
                                
                                <Button className="bg-[#181e25] text-white dark:border dark:border-gray-700"
                                    isLoading={isSubmitting}
                                    type="submit"
                                    spinner={Spinner}
                                >
                                    Guardar cambios
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModificarUsuarioModal;