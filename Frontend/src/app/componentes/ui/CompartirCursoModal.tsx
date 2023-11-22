import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
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

    const [emails, setEmails] = useState<string[]>([])
    const [emailInput, setEmailInput] = useState('');

    const handleAddEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(emailInput === '') return;
        if (emails.includes(emailInput)) return;
        setEmails([...emails, emailInput]);
        setEmailInput('');
    }

    const [emailSent, setEmailSent] = useState(false)
    const [emailLoading, setEmailLoading] = useState(false)
    const sendEmails = async () => {
        setEmailLoading(true)
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.enviarEmails(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emails, idCurso: cursoId, nombre: cursoTitle, token: data?.token }),
        })
        
        if(res.ok) setEmailSent(true)
        setEmailLoading(false)
    }

    const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailSent(false)
        setEmailInput(e.target.value)
    }

    const personalizedOnOpenChange = (isOpen: boolean) => {

        // isOpen es el estado del modal cuando el usuario lo cerro (pero visualmente todav no se cerro)
        if (!isOpen) {
            // reiniciar el estado del modal si se cierra
            setEmails([])
            setEmailInput('')
            setEmailSent(false)
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
                                    <Divider className="mt-3 w-[50%]" />
                                </article>
                                <article className="flex flex-col gap-2">
                                    <h2>Invitación por correo</h2>
                                    <form onSubmit={handleAddEmail} className="flex gap-2">
                                        <Input
                                            variant="bordered"
                                            type="email"
                                            placeholder="Correo electrónico"
                                            value={emailInput}
                                            onChange={handleInputOnChange}
                                        />
                                        <Button
                                            variant="ghost"
                                            isIconOnly
                                            type="submit"
                                        >
                                            <PersonAddIcon theme={currentTheme ?? 'light'} />
                                        </Button>
                                    </form>
                                    {emails.map((email) => (
                                        <div key={email} className="flex gap-2 w-full justify-between items-center px-2">
                                            <p key={email}>{email}</p>
                                            <Button
                                                variant="light"
                                                isIconOnly
                                                onClick={() => setEmails(emails.filter((e) => e !== email))}
                                            >
                                                <CrossIcon />
                                            </Button>
                                        </div>
                                    ))}
                                    {emails.length > 0 &&
                                        <Button
                                            variant="flat"
                                            onClick={sendEmails}
                                            isLoading={emailLoading}
                                            className={emailSent ? "bg-green-100 dark:bg-green-700" : ""}
                                        >
                                            {emailSent ? "Invitaciones enviadas" : "Enviar Invitaciones"}
                                        </Button>
                                    }
                                </article>
                            </section>
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