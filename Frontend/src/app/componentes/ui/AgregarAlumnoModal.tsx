import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import ListForm from "./ListForm"
import { useState } from "react"
import useSWR from "swr"
import endpoints from "@/lib/endpoints"

type AgregarAlumnoModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    idCurso: string,
    mutarDatos: () => void
    idUser: string
}

type TokenAnadirCurso = {
    token: string
}

const fetcher = (url: string, idDocente: string) => (
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idDocente }),
    })
        .then(res => res.json())
)

const AgregarAlumnoModal = ({ isOpen, onOpenChange, idCurso, mutarDatos, idUser }: AgregarAlumnoModalProps) => {

    const { data, isLoading, error } = useSWR<TokenAnadirCurso>(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/token/cursos/${idCurso}`, (url: string) => fetcher(url, idUser))

    const handleOnSubmit = async (emails: string[]) => {

        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.enviarEmails(idCurso), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emails, token: data?.token, enviarInvitacionSiExiste: false }),
        })

        mutarDatos()
        return res
    }

    const [resetState, setResetState] = useState(false)

    const personalizedOnOpenChange = (isOpen: boolean) => {

        // isOpen es el estado del modal cuando el usuario lo cerro (pero visualmente todav no se cerro)
        if (!isOpen) {
            // reiniciar el estado del modal si se cierra
            setResetState(true)
        }

        // funcion del hook para cerrar el modal
        onOpenChange()
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={personalizedOnOpenChange} classNames={{ closeButton: "m-3" }} className="max-h-[90%] overflow-auto">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Agregar alumnos al curso</ModalHeader>
                        <ModalBody>
                            <ListForm
                                title="Alumnos"
                                inputPlacholder="Correo electrónico"
                                buttonMessage="Agregar"
                                buttonMessageOk="Alumnos agregados"
                                buttonMessageError="Hubo un error al agregar los alumnos"
                                onSubmitForm={handleOnSubmit}
                                resetState={resetState}
                            />
                        </ModalBody>
                        <ModalFooter className="p-2">

                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AgregarAlumnoModal