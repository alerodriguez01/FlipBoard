'use client';
import { AlumnosTable } from "@/app/componentes/ui/AlumnosTable";
import { AsignarRubricaModal } from "@/app/componentes/ui/AsignarRubricaModal";
import { CrearGrupoModal } from "@/app/componentes/ui/CrearGrupoModal";
import { GruposTable } from "@/app/componentes/ui/GruposTable";
import { Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function Participantes({ params }: { params: { idCurso: string } }) {

    // para despues saber si es docente
    const { data: session, status } = useSession();
    const { isOpen: isGrupoOpen, onOpen: onGrupoOpen, onOpenChange: onGrupoOpenChange } = useDisclosure();
    const { isOpen: isAsignarOpen, onOpen: onAsignarOpen, onOpenChange: onAsignarOpenChange } = useDisclosure();
    const esDocente = !!session?.user.cursosDocente.includes(params.idCurso);

    if (status === 'loading' || !session?.user)
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    return (
        <section className="flex flex-1 flex-col p-10 gap-4 overflow-auto">
            <Tabs variant="underlined" size="lg">
                <Tab key="participantes" title="Participantes">
                    <AlumnosTable
                    idCurso={params.idCurso} 
                    editable={esDocente}
                    evaluable={esDocente}
                    onEvaluarPress={(userId) => alert(`TODO: EVALUAR userID: ${userId}`)}
                    onAgregarAlumnoPress={() => alert("TODO: AGREGAR ALUMNO")}
                    onAsignarRubricaPress={onAsignarOpen} />
                </Tab>
                <Tab key="grupos" title="Grupos">
                    <GruposTable 
                        idCurso={params.idCurso} 
                        editable={esDocente}
                        evaluable={esDocente}
                        onEvaluarPress={(grupoId) => alert(`TODO: EVALUAR grupoID: ${grupoId}`)}
                        onCrearGrupoPress={onGrupoOpen}
                        onEditarPress={(grupoId) => alert(`TODO: EDITAR grupoId: ${grupoId}`)} 
                        onAsignarRubricaPress={onAsignarOpen}/>
                </Tab>
            </Tabs>
            <CrearGrupoModal isOpen={isGrupoOpen} onOpenChange={onGrupoOpenChange} idCurso={params.idCurso} />
            {esDocente && 
                <AsignarRubricaModal isOpen={isAsignarOpen} onOpenChange={onAsignarOpenChange} idCurso={params.idCurso} idUsuario={session.user.id}/>}
        </section>
    )
}