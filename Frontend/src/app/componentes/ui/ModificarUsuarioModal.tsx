import { Usuario } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch } from "@nextui-org/react"
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import { Spinner } from "./Spinner";

type ModalProps = {
    isOpen: boolean,
    onOpenChange: any,
    user: Usuario
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
    superUser: z.boolean()
});

type UserForm = z.infer<typeof userSchema> & { erroresExternos?: string };

const ModificarUsuarioModal = (props: ModalProps) => {

    const {
        register,
        control,
        handleSubmit,
        formState: {
          errors,
          isSubmitting
        },
    } = useForm<UserForm>({
        resolver: zodResolver(userSchema)
    });

    const onSubmit = async (data: UserForm) => {
        console.log(data);
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            placement="center"    
        >
            <ModalContent>
                <ModalHeader className="flex flex-col">
                    Modificar usuario
                    <h1 className='text-xs font-normal'><span className='font-semibold'>ID:</span> {props.user.id}</h1>
                </ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="flex flex-col justify-center">
                        <Input
                            variant="bordered"
                            label="Nombre"
                            isRequired
                            isInvalid={!!errors.nombre}
                            errorMessage={errors.nombre?.message}
                            defaultValue={props.user.nombre.split(' ').map(w => w[0].toUpperCase()+w.substring(1)).join(' ')}
                            {...register("nombre")}
                        />
                        <Input
                            variant="bordered"
                            label="Correo"
                            isRequired
                            isInvalid={!!errors.correo}
                            errorMessage={errors.correo?.message}
                            defaultValue={props.user.correo}
                            {...register("correo")}
                        />
                        <Input
                            variant="bordered"
                            label="Nueva contraseña"
                            isInvalid={!!errors.contrasena}
                            errorMessage={errors.contrasena?.message}
                            {...register("contrasena")}
                        />
                    </ModalBody>
                    <input type="text" className="hidden"  />
                    {errors.erroresExternos &&
                        <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>}
                    <ModalFooter className="flex flex-row justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <Controller
                                control={control}
                                name="superUser"
                                defaultValue={!!props.user.superUser}
                                render={({ field }) => (
                                    <Switch
                                        size="sm"
                                        isSelected={field.value}
                                        onChange={field.onChange}
                                    >Administrador</Switch>
                                )}
                            />
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
            </ModalContent>
        </Modal>
    )
}

export default ModificarUsuarioModal;