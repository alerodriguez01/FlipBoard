'use client';
import { AlumnosTable } from "@/app/componentes/ui/AlumnosTable";
import { Spinner, Tab, Tabs } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function Participantes({ params }: { params: { idCurso: string } }) {

    // para despues saber si es docente
    const { data: session, status } = useSession();

    if (status === 'loading')
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    return (
        <section className="flex flex-1 flex-col p-10 gap-4 overflow-auto">
            <Tabs variant="underlined" size="lg">
                <Tab key="participantes" title="Participantes"/>
                <Tab key="grupos" title="Grupos"/>
            </Tabs>

            <AlumnosTable
                idCurso={params.idCurso} 
                editable={!!session?.user.cursosDocente.includes(params.idCurso)}
                evaluable={!!session?.user.cursosDocente.includes(params.idCurso)}
                onEvaluarPress={(userId) => alert(`TODO: EVALUAR userID: ${userId}`)}
                onAgregarAlumnoPress={() => alert("TODO: AGREGAR ALUMNO")}
                onAsignarRubricaPress={() => alert("TODO: ASIGNAR RUBRICA")} />
        </section>
    )
}