"use client"
import EvaluarMural from "@/app/componentes/EvaluarMural";
import SwitchTheme from "@/app/componentes/ui/SwitchTheme";
import { useTheme } from "next-themes";
import { Excalidraw, Footer, LiveCollaborationTrigger, Sidebar, WelcomeScreen } from "@excalidraw/excalidraw";
import { RubricaIcon } from "@/app/componentes/ui/icons/RubricaIcon";
import { useState } from "react";
import { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { Button, Tooltip } from "@nextui-org/react";
import { InfoIcon } from "@/app/componentes/ui/icons/InfoIcon";
import useSWR from "swr";
import endpoints from "@/lib/endpoints";
import { Mural } from "@/lib/types";

export default function Mural({ params: { idMural } }: { params: { idMural: string } }) {

    const { theme, setTheme } = useTheme()
    const currentTheme = theme === 'dark' ? 'dark' : 'light'

    const { data: mural, error, isLoading, mutate } = useSWR<Mural>(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getMuralById(idMural), (url: string) => fetch(url).then(res => res.json()));

    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPIRefValue | null>(null);

    

    return (
        <main className="flex justify-center items-center h-screen ">
            <section className="flex-1 h-full flex justify-center items-center relative">
                <Excalidraw
                    theme={currentTheme}
                    UIOptions={{
                        canvasActions: {
                            clearCanvas: true,
                            // toggleTheme: true,
                        }
                    }}
                    ref={(api) => setExcalidrawAPI(api)}
                    renderTopRightUI={() =>

                        <div className="flex gap-1">

                            <LiveCollaborationTrigger isCollaborating onSelect={async () => {
                                const api = await excalidrawAPI?.readyPromise
                                api?.setToast({ message: "La colaboración ya se encuentra activa", duration: 3000 })
                                console.log(api?.id)
                            }} />

                            <SwitchTheme />

                            <Sidebar.Trigger
                                name="Evaluar"
                                style={{
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                }}
                                tab="alumnos"
                            >
                                <div className="flex items-center gap-2">
                                    <RubricaIcon theme={currentTheme} />
                                    Evaluar
                                </div>
                            </Sidebar.Trigger>

                        </div>

                    }
                /* Por si no queremos tener el SwitchTheme en el topRightUI. En tal caso, se cambia el tema desde la hamburguesa 
                onChange={(excalidrawElements, appState, files) => {
                    if(appState.theme !== currentTheme) setTheme(appState.theme)
                }}*/
                >
                    <WelcomeScreen>
                        <WelcomeScreen.Center>
                            <WelcomeScreen.Center.Logo />
                            <WelcomeScreen.Center.Heading>
                                {mural?.nombre}
                            </WelcomeScreen.Center.Heading>
                        </WelcomeScreen.Center>
                    </WelcomeScreen>

                    <Sidebar
                        name="Evaluar"
                        style={{
                            paddingLeft: '0.5rem',
                            paddingRight: '0.5rem',
                        }}
                    >

                        <Sidebar.Header>
                            <h1 className="text-xl font-semibold text-[#6965DB] dark:text-[#A8A5FF]">Evaluación</h1>
                        </Sidebar.Header>

                        <Sidebar.Tabs>

                            <Sidebar.TabTriggers>
                                <Sidebar.TabTrigger tab="alumnos">Alumnos</Sidebar.TabTrigger>
                                <Sidebar.TabTrigger tab="grupos">Grupos</Sidebar.TabTrigger>
                            </Sidebar.TabTriggers>

                            <Sidebar.Tab tab="alumnos" className="max-h-[calc(99vh-117px)] overflow-auto my-2">
                                <EvaluarMural tipo="alumnos" />
                            </Sidebar.Tab>

                            <Sidebar.Tab tab="grupos">
                                <EvaluarMural tipo="grupos" />
                            </Sidebar.Tab>


                        </Sidebar.Tabs>

                    </Sidebar>

                    <Footer>
                        <Tooltip
                            showArrow={false}
                            placement="right"
                            className="bg-gray-200 text-black"
                            content={mural &&
                                <article className="text-sm">
                                    <h1 className="font-semibold">Información del mural</h1>
                                    <ul>
                                        <li>Nombre: {mural?.nombre}</li>
                                        <li>Contenido: {mural?.contenido}</li>
                                        {mural?.descripcion && <li>Descripcion: {mural.descripcion}</li>}
                                    </ul>
                                </article>
                            }>
                            <Button isIconOnly disableAnimation className="bg-transparent rounded-full">
                                <InfoIcon width={18} height={18} theme={theme} />
                            </Button>
                        </Tooltip>
                    </Footer>

                </Excalidraw>
            </section>
        </main>
    )
}