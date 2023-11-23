"use client"
import CalificacionesAlumno from "@/app/componentes/ui/CalificacionesAlumno";
import CalificacionesDocente from "@/app/componentes/ui/CalificacionesDocente";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Calificaciones({ params: { idCurso } }: { params: { idCurso: string } }) {

    const { data: session, status } = useSession();
    const isDocente = session?.user.cursosDocente.includes(idCurso)

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
            <PagesHeader title={isDocente ? "Calificaciones realizadas" : "Mis calificaciones"} searchable={false} />
            {isDocente ?
                <CalificacionesDocente idCurso={idCurso} idDocente={session.user.id} />
                :
                <CalificacionesAlumno idCurso={idCurso} idAlumno={session.user.id} />
            }
        </section>
    )
}