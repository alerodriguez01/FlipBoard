import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react"
import { useTheme } from "next-themes"
import CopyIcon from "./icons/CopyIcon"
import QRCode from "react-qr-code"
import { ChangeEvent, useEffect, useState } from "react"
import TextCopied from "./icons/TextCopied"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import { PersonAddIcon } from "./icons/PersonAddIcon"
import { CrossIcon } from "./icons/CrossIcon"
import endpoints from "@/lib/endpoints"
import ListForm from "./ListForm"

type CompartirCursoModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    cursoId: string,
    cursoTitle: string
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


const CompartirCursoModal = ({ isOpen, onOpenChange, cursoId, cursoTitle }: CompartirCursoModalProps) => {

    const { theme, systemTheme, setTheme } = useTheme()
    const currentTheme = theme === "system" ? systemTheme : theme

    const { data: session } = useSession()

    // fetch al backend para obtener el token
    const { data, isLoading, error } = useSWR<TokenAnadirCurso>(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/token/cursos/${cursoId}`, (url: string) => fetcher(url, session?.user.id ?? ""))
    const urlQr = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/cursos/${cursoId}?token=${data?.token}`

    const [textCopied, setTextCopied] = useState(false)

    useEffect(() => {
        if (textCopied) {
            const timeout = setTimeout(() => {
                setTextCopied(false)
            }, 1500)
        }
    }, [textCopied])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(urlQr)
        setTextCopied(true)
    }

    const sendEmails = async (emails: string[]) => {

        return await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.enviarEmails(cursoId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emails, token: data?.token, enviarInvitacionSiExiste: true }),
        })
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
                        <ModalHeader>Compartir curso</ModalHeader>
                        <ModalBody>
                            <section className="flex flex-col gap-2">
                                <article className="flex flex-col gap-2 items-center">
                                    <h1 className="text-lg font-medium">{cursoTitle}</h1>
                                    {isLoading ?
                                        <Spinner color="primary" size="lg" className="justify-center items-center h-full" />
                                        :
                                        <QRCode
                                            className="max-w-[50%] h-auto bg-white p-1 rounded shadow-md dark:shadow-gray-500 border border-red"
                                            value={urlQr}
                                        />
                                    }
                                    <Button
                                        variant="ghost"
                                        className={"w-60 border-gray-700 dark:border-gray-300 mt-2" + (textCopied ? " bg-green-100 dark:bg-green-700" : "")}
                                        startContent={textCopied ?
                                            <TextCopied theme={currentTheme ?? 'light'} />
                                            :
                                            <CopyIcon theme={currentTheme ?? 'light'} />
                                        }
                                        onPress={copyToClipboard}
                                    >
                                        Copiar enlace de acceso
                                    </Button>
                                    <Divider className="mt-3 w-[50%]" />
                                </article>
                                <ListForm
                                    title="Invitación por correo"
                                    inputPlacholder="Correo electrónico"
                                    buttonMessage="Enviar invitaciones"
                                    buttonMessageOk="Invitaciones enviadas"
                                    buttonMessageError="Hubo un error al enviar las invitaciones"
                                    onSubmitForm={sendEmails}
                                    resetState={resetState}
                                />
                            </section>
                        </ModalBody>
                        <ModalFooter className="p-2">
                            {/* <Button color="primary" onPress={onClose}>
                                Action
                            </Button> */}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default CompartirCursoModal