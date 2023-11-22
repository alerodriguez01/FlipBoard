import endpoints from '@/lib/endpoints'
import { generateContenidoMural } from '@/lib/excalidraw_utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { z } from 'zod'
import { RubricaIcon } from './icons/RubricaIcon'
import { useTheme } from 'next-themes'
import { Rubrica } from '@/lib/types'
import { toMayusFirstLetters } from '@/lib/utils'

type CrearMuralModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    mutateData: () => void,
    cursoId: string,
    userId: string,
    openAsignarRubrica: () => void,
    rubrica: Rubrica | null,
    setRubrica: React.Dispatch<React.SetStateAction<Rubrica | null>>
}

// schema para validar los datos del formulario
const muralSchema = z.object({
    nombre: z.string(),
    descripcion: z.string()
})
// tipo inferido a partir del schema
type MuralCreate = z.infer<typeof muralSchema> & Rubrica
    & { erroresExternos?: string } // le agrego el atributo erroresExternos para poder mostrar errores de la API al final del formulario

const CrearMuralModal = ({ isOpen, onOpenChange, mutateData, cursoId, userId, openAsignarRubrica, rubrica, setRubrica }: CrearMuralModalProps) => {

    const { theme, systemTheme, setTheme } = useTheme()
    const currentTheme = theme === "system" ? systemTheme : theme

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
            idDocente: userId,
            idRubrica: rubrica?.id // si no se asigno ninguna rubrica, se envia null
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
                setRubrica(null) // seteo en null la rubrica para que si se crea otro mural, no quede asignada la misma rubrica
                reset()
                mutateData()
                onClose()
            }

        } catch (e) {
            setError("erroresExternos", { message: "Hubo un problema al crear el mural." })
        }
    }

    const personalizedOnOpenChange = (isOpen: boolean, goToAsignarRubrica?: boolean) => {

        // isOpen es el estado del modal cuando el usuario lo cerro (pero visualmente todav no se cerro)
        if (!isOpen && !goToAsignarRubrica) {
            // reiniciar el estado del modal si se cierra
            setRubrica(null) // seteo en null la rubrica para que si se crea otro mural, no quede asignada la misma rubrica
            reset()
        }

        if (goToAsignarRubrica) {
            // abrir el modal de asignar rubrica
            openAsignarRubrica()
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
                        <ModalBody className='pt-0'>
                            <Input
                                variant="bordered"
                                type="text"
                                label="Nombre"
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

                            <Divider className='max-w-[50%] self-center mt-1' />
                            <h3 className=''>Rúbrica <span className='text-xs align-top'>*</span></h3>
                            <div className='flex gap-3 items-center justify-between'>
                                {rubrica ?
                                    <p className='text-sm'>Rúbrica asignada: <span className='italic'>{toMayusFirstLetters(rubrica.nombre)}</span></p>
                                    :
                                    <p className='italic text-sm'>No se ha asignado ninguna rúbrica</p>
                                }
                                <Button
                                    className='min-w-[50%]'
                                    variant="ghost"
                                    startContent={<RubricaIcon toggle={true} theme={currentTheme || "light"} />}
                                    onPress={() => personalizedOnOpenChange(false, true)}
                                >
                                    {rubrica ?
                                        "Cambiar rúbrica"
                                        :
                                        "Asignar rúbrica"
                                    }
                                </Button>
                            </div>
                            {!rubrica && <p className='text-xs'>* Puedes asignarla más tarde</p>}

                            <input type="text" className="hidden" {...register("erroresExternos")} />
                            {errors.erroresExternos &&
                                <p className="text-red-500 text-sm">{`${errors.erroresExternos.message}`}</p>
                            }
                        </ModalBody>
                        <ModalFooter className='flex items-center justify-between'>
                            <p className="text-red-600">* Campos obligatorios</p>
                            <Button type='submit' className='bg-[#181e25] text-white dark:border dark:border-gray-700 w-[40%]'>
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