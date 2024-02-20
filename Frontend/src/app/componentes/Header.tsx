"use client"
import ButtonTheme from "@/app/componentes/ui/SwitchTheme"
import endpoints from "@/lib/endpoints"
import { Curso } from "@/lib/types"
import { Button, Tooltip } from "@nextui-org/react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import useSWR from "swr"
import { InfoIcon } from "./ui/icons/InfoIcon"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Header = () => {

    const { data: session, status } = useSession()
    // nombre del user con la primera letra mayuscula
    let nombre = session?.user.nombre.split(" ")[0]
    if (nombre) nombre = nombre[0].toUpperCase() + nombre.slice(1)

    const [mounted, setMounted] = useState(false)
    const { theme, systemTheme } = useTheme()
    const currentTheme = theme === "system" ? systemTheme : theme

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    const pathname = usePathname()
    const isCursosOrRubricasOrAyuda = ["/cursos", "/rubricas", "/rubricas/crear", "/ayuda"].includes(pathname);

    const idCurso = pathname.split("/")[2] ?? ""
    const { data: curso, error, isLoading } = useSWR<Curso>(session && !isCursosOrRubricasOrAyuda ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getCursoById(idCurso) : null, (url: string) => fetch(url, { headers: { "Authorization": session?.user.token || "" } }).then(res => res.json()));


    return (
        <header className="flex items-center bg-gray-300 dark:text-white dark:bg-gray-900 p-6 shadow-md shadow-slate-300 dark:shadow-slate-950">
            {
                isCursosOrRubricasOrAyuda ?
                    session ? <h1 className="flex-1 text-md">Hola <span className="font-medium italic">{nombre}</span>, ¡bienvenido!</h1> : <h1 className="flex-1"></h1>
                    :
                    <section className="flex-1" >
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">{curso?.nombre}</h1>
                            {
                                <Tooltip
                                    showArrow={false}
                                    placement="right"
                                    className="bg-gray-200 text-black max-w-[400px]"
                                    content={
                                        <article className="text-sm">
                                            <h1 className="font-semibold">Información del curso</h1>
                                            <ul>
                                                {curso?.tema && <li>Tema: {curso?.tema}</li>}
                                                {curso?.descripcion && <li>Descripción: {curso?.descripcion}</li>}
                                                {curso?.emailContacto && <li className="text-sm">Contacto: <a className="text-blue-600 italic" href={"mailto:" + curso?.emailContacto}>{curso?.emailContacto}</a></li>}
                                                {curso?.sitioweb && <li>Sitio web: <a href={curso?.sitioweb} className="text-blue-600 italic">{curso?.sitioweb}</a></li>}
                                            </ul>
                                        </article>
                                    }>
                                    <Button isIconOnly disableAnimation className="bg-transparent rounded-full">
                                        {mounted && <InfoIcon width={18} height={18} theme={currentTheme} />}
                                    </Button>
                                </Tooltip>
                            }
                        </div>
                    </section>
            }
            <ButtonTheme />
        </header>
    )
}

export default Header