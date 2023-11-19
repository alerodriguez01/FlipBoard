import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { useTheme } from "next-themes"
import CopyIcon from "./icons/CopyIcon"
import QRCode from "react-qr-code"
import { useEffect, useState } from "react"
import TextCopied from "./icons/TextCopied"
import useSWR from "swr"
import { useSession } from "next-auth/react"

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

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ closeButton: "m-3" }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Compartir curso</ModalHeader>
                        <ModalBody>
                            <article className="flex flex-col gap-2 items-center">
                                <h1 className="text-lg font-medium">{cursoTitle}</h1>
                                <QRCode
                                    className="max-w-[50%] h-auto bg-white p-1 rounded shadow-md dark:shadow-gray-500 border border-red"
                                    value={urlQr}
                                />
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
                            </article>
                        </ModalBody>
                        <ModalFooter>
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