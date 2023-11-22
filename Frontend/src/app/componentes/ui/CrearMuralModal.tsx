import endpoints from '@/lib/endpoints'
import { generateContenidoMural } from '@/lib/excalidraw_utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type CrearMuralModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    mutateData: () => void,
    cursoId: string,
    userId: string
}

// schema para validar los datos del formulario
const muralSchema = z.object({
    nombre: z.string(),
    descripcion: z.string()
})
// tipo inferido a partir del schema
type MuralCreate = z.infer<typeof muralSchema> & { erroresExternos?: string } // le agrego el atributo erroresExternos para poder mostrar errores de la API al final del formulario

const CrearMuralModal = ({ isOpen, onOpenChange, mutateData, cursoId, userId }: CrearMuralModalProps) => {

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
    } = useForm<MuralCreate>({
        resolver: zodResolver(muralSchema)
    })

    const onSubmit = async (data: MuralCreate, onClose: () => void) => {

        const mural = {
            nombre: data.nombre,
            contenido: await generateContenidoMural(),
            descripcion: data.descripcion,
            idDocente: userId
            // idRubrica
        }

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.crearMural(cursoId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mural),
            })

            if (!res.ok) {
                // Faltan datos obligatorios o no se encontro el curso o la rubrica
                setError("erroresExternos", { message: "Hubo un problema al crear el mural." })

            } else {
                reset()
                mutateData()
                onClose()
            }

        } catch (e) {
            setError("erroresExternos", { message: "Hubo un problema al crear el mural." })
        }
    }

    const personalizedOnOpenChange = (isOpen: boolean) => {

        // isOpen es el estado del modal cuando el usuario lo cerro (pero visualmente todav no se cerro)
        if (!isOpen) {
            // reiniciar el estado del modal si se cierra
            reset()
        }

        // funcion del hook para cerrar el modal
        onOpenChange()
    }


    return (
        <Modal isOpen={isOpen} onOpenChange={personalizedOnOpenChange} classNames={{ closeButton: "m-3" }} className="max-h-[90%] overflow-auto">
            <ModalContent>
                {(onClose) => (
                    <form action="" onSubmit={handleSubmit((data: MuralCreate) => onSubmit(data, onClose))} className='flex flex-col gap-3'>
                        <ModalHeader className="flex flex-col gap-1">Nuevo mural</ModalHeader>
                        <ModalBody>
                            <Input
                                variant="bordered"
                                type="text"
                                label="Nombre del mural"
                                placeholder="Ej.: Teoría de grafos"
                                isRequired
                                isInvalid={!!errors.nombre} // !! -> convierte a booleano la existencia del error en la valdadacion del input
                                errorMessage={errors.nombre?.message} // se isInvalid es true, se muestra el mensaje de error
                                {...register("nombre")}
                            />
                            <Textarea
                                variant="bordered"
                                label="Descripción"
                                placeholder="Ej.: Se abordarán los conceptos introductorios de teoría de grafos"
                                maxRows={4}
                                isInvalid={!!errors.descripcion}
                                errorMessage={errors.descripcion?.message}
                                {...register("descripcion")}
                            />
                            <input type="text" className="hidden" {...register("erroresExternos")} />
                            {errors.erroresExternos &&
                                <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>
                            }
                        </ModalBody>
                        <ModalFooter className='pt-0'>
                            <Button type='submit' className='bg-[#181e25] text-white dark:border dark:border-gray-700 max-w-[35%]'>
                                Crear mural
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    )
}

export default CrearMuralModal