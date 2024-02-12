import Image, { StaticImageData } from "next/image";
import curso from "../../../../public/ayuda/cursos1.png";
import rubrica from "../../../../public/ayuda/rubricas2.png";
import { ReactNode } from "react";
import { Divider } from "@nextui-org/divider";

const Article = ({children, id, title}: {children?: ReactNode, id: string, title: string}) => {
    return (
        <>
            <article>
                <h1 id={id} className="text-3xl font-bold mb-2">{title}</h1>
                {children}
            </article>
            <Divider className="my-8"/>
        </>
    )
}

const IMG = ({src, alt}: {src: StaticImageData, alt: string}) => {
    return <Image src={src} alt={alt} className="px-6 py-2"/>
}

const H2 = ({children, id}: {children: ReactNode, id: string}) => {
    return <h2 id={id} className="text-xl font-bold mb-1">{children}</h2>
}

const UL = ({children}: {children: ReactNode}) => {
    return <ul className="list-disc list-inside p-1 ml-2">{children}</ul>
}


export default function Ayuda() {
    return (
        <section className="flex flex-row h-screen p-8 gap-2">
            <div className="w-[80%] flex flex-col h-full max-h-screen overflow-y-auto">
                <Article id="cursos" title="Información sobre cursos">
                    <H2 id="crear-curso">Ver y crear cursos</H2>
                    <p>En la sección Mis cursos puede ver todos los cursos de los que forma parte, ya sea como alumno o como docente. Si desea crear un curso, puede realizarlo presionando el botón “Crear nuevo curso” (1)</p>
                    <IMG src={curso} alt="Seccion Mis cursos"/>
                    <p>Al presionar “Crear un nuevo curso”, le aparecerá un cuadro de diálogo con la información del curso a completar.</p>
                </Article>
                <Article id="rubricas" title="Información sobre rúbricas">
                    <H2 id="crear-rubrica">Creación de rúbricas</H2>
                    <p>Al presionar “Crear nueva rúbrica”, le aparecerá una nueva pantalla con la información de la rúbrica a completar.</p>
                    <UL>
                        <li>Presionando el botón (1) podrá agregar más niveles para evaluar.</li>
                        <li>Presionando el botón (2) podrá agregar más criterios de evaluación.</li>
                        <li>Para crear finalmente la rúbrica, puede presionar el botón “Crear rúbrica” (3).</li>
                    </UL>
                    <IMG src={rubrica} alt="Creacion de una rubrica"/>
                </Article>
            </div>
            <aside className="w-[20%] max-h-screen overflow-y-auto">
                <ul>
                    <li><a href="#cursos">Información sobre cursos</a></li>
                    <li><a href="#rubricas">Información sobre rúbricas</a></li>
                </ul>
            </aside>
        </section>
    );
}