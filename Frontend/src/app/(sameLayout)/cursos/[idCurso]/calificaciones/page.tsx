"use client"
import CalificacionesAlumno from "@/app/componentes/ui/CalificacionesAlumno";
import CalificacionesDocente from "@/app/componentes/ui/CalificacionesDocente";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { DownloadIcon } from "@/app/componentes/ui/icons/DownloadIcon";
import { InfoIcon } from "@/app/componentes/ui/icons/InfoIcon";
import endpoints from "@/lib/endpoints";
import { Button, Spinner, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Calificaciones({ params: { idCurso } }: { params: { idCurso: string } }) {

    const { data: session, status } = useSession();
    const isDocente = session?.user.cursosDocente.includes(idCurso)

    const downloadCsv = async () => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.downloadCalificaciones(idCurso))
            const blob = await res.blob()

            // Create a link element
            const link = document.createElement('a');

            // Create a URL for the blob
            const url = URL.createObjectURL(blob);

            // Set link properties
            link.href = url;
            link.download = 'calificaciones.csv';

            // Append the link to the document and programmatically click it
            document.body.appendChild(link);
            link.click();

            // Clean up: remove the link and revoke the blob URL
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (e) {
            console.error("Hubo un error al descargar las calificaciones")
        }
    }

    if (status === 'loading')
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    if (!session?.user.cursosAlumno.includes(idCurso) && !session?.user.cursosDocente.includes(idCurso)) {
        return (
            <section className="flex flex-col flex-1 justify-center items-center">
                <h1>No tienes acceso a este curso</h1>
                <Link href="/cursos" className="text-blue-600 hover:underline">Volver a cursos</Link>
            </section>
        )
    }

    return (
        <section className="flex flex-col flex-1 p-10 gap-4 overflow-auto">
            <header className="flex flex-row justify-between items-center mb-4 mx-2.5">
                <h1 className="text-2xl font-semibold self-center">{isDocente ? "Calificaciones realizadas" : "Mis calificaciones"}</h1>
                <Tooltip
                    showArrow={false}
                    placement="bottom"
                    className="max-w-[300px]"
                    content={
                        <p className="text-sm">Descargar todas las calificaciones</p>
                    }>
                    <Button isIconOnly className="bg-transparent" onClick={downloadCsv}>
                        <DownloadIcon />
                    </Button>
                </Tooltip>
            </header>
            {isDocente ?
                <CalificacionesDocente idCurso={idCurso} idDocente={session.user.id} />
                :
                <CalificacionesAlumno idCurso={idCurso} idAlumno={session.user.id} />
            }
        </section>
    )
}