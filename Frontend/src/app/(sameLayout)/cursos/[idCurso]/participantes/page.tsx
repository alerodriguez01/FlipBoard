'use client';
import { AlumnosTable } from "@/app/componentes/ui/AlumnosTable";
import { AsignarRubricaModal } from "@/app/componentes/ui/AsignarRubricaModal";
import { CrearGrupoModal } from "@/app/componentes/ui/CrearGrupoModal";
import { EvaluarModal } from "@/app/componentes/ui/EvaluarModal";
import { GruposTable } from "@/app/componentes/ui/GruposTable";
import { Grupo, Usuario } from "@/lib/types";
import { Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function Participantes({ params }: { params: { idCurso: string } }) {

    // para despues saber si es docente
    const { data: session, status } = useSession();
    const { isOpen: isGrupoOpen, onOpen: onGrupoOpen, onOpenChange: onGrupoOpenChange } = useDisclosure();
    const { isOpen: isAsignarOpen, onOpen: onAsignarOpen, onOpenChange: onAsignarOpenChange } = useDisclosure();
    const { isOpen: isEvaluarOpen, onOpen: onEvaluarOpen, onOpenChange: onEvaluarOpenChange } = useDisclosure();
    const esDocente = !!session?.user.cursosDocente.includes(params.idCurso);
    const [evaluarEntity, setEvaluarEntity] = React.useState<Usuario | Grupo>();
    const [entityType, setEntityType] = React.useState<"Usuario" | "Grupo" | undefined>();

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
                    onEvaluarPress={(user) => {setEvaluarEntity(user); setEntityType('Usuario'); onEvaluarOpen();}}
                    onAgregarAlumnoPress={() => alert("TODO: AGREGAR ALUMNO")}
                    onAsignarRubricaPress={onAsignarOpen} />
                </Tab>
                <Tab key="grupos" title="Grupos">
                    <GruposTable 
                        idCurso={params.idCurso} 
                        editable={esDocente}
                        evaluable={esDocente}
                        onEvaluarPress={(grupo) => {setEvaluarEntity(grupo); setEntityType('Grupo'); onEvaluarOpen();}}
                        onCrearGrupoPress={onGrupoOpen}
                        onEditarPress={(grupoId) => alert(`TODO: EDITAR grupoId: ${grupoId}`)} 
                        onAsignarRubricaPress={onAsignarOpen}/>
                </Tab>
            </Tabs>
            <CrearGrupoModal isOpen={isGrupoOpen} onOpenChange={onGrupoOpenChange} idCurso={params.idCurso} />
            {esDocente && 
                <AsignarRubricaModal isOpen={isAsignarOpen} onOpenChange={onAsignarOpenChange} idCurso={params.idCurso} idUsuario={session.user.id}/>}
            {esDocente &&
                <EvaluarModal isOpen={isEvaluarOpen} onOpenChange={onEvaluarOpenChange} entity={evaluarEntity} idDocente={session.user.id} entityType={entityType} idCurso={params.idCurso}/>}
        </section>
    )
}