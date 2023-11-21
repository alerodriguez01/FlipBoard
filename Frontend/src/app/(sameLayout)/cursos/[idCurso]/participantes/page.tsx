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
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import Link from "next/link";


export default function Participantes({ params }: { params: { idCurso: string } }) {

    // para despues saber si es docente
    const { data: session, status } = useSession();
    const { isOpen: isGrupoOpen, onOpen: onGrupoOpen, onOpenChange: onGrupoOpenChange } = useDisclosure();
    const { isOpen: isAsignarOpen, onOpen: onAsignarOpen, onOpenChange: onAsignarOpenChange } = useDisclosure();
    const { isOpen: isEvaluarOpen, onOpen: onEvaluarOpen, onOpenChange: onEvaluarOpenChange } = useDisclosure();
    const esDocente = !!session?.user.cursosDocente.includes(params.idCurso);
    const [evaluarEntity, setEvaluarEntity] = React.useState<Usuario | Grupo>();
    const [entityType, setEntityType] = React.useState<"Usuario" | "Grupo" | undefined>();
    const [asignarMode, setAsignarMode] = React.useState<'alumno' | 'grupo'>();

    // para que se refresque la tabla de grupos cuando se crea uno nuevo
    const [mutateGrupos, setMutateGrupos] = useState(0);
    const onCreateGrupoSuccess = () => {
        setMutateGrupos(prev => prev + 1);
    }

    if (status === 'loading' || !session?.user)
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    if ( !session?.user.cursosAlumno.includes(params.idCurso) && !session?.user.cursosDocente.includes(params.idCurso)) {
        return (
            <section className="flex flex-col flex-1 justify-center items-center">
                <h1>No tienes acceso a este curso</h1>
                <Link href="/cursos" className="text-blue-600 hover:underline">Volver a cursos</Link>
            </section>
        )
    }

    return (
        <section className="flex flex-1 flex-col p-8 gap-2 overflow-auto">
            <PagesHeader title="Participantes" searchable={false} />
            <Tabs variant="underlined" size="lg">
                <Tab key="participantes" title="Alumnos">
                    <AlumnosTable
                    idCurso={params.idCurso} 
                    editable={esDocente}
                    evaluable={esDocente}
                    onEvaluarPress={(user) => {setEvaluarEntity(user); setEntityType('Usuario'); onEvaluarOpen();}}
                    onAgregarAlumnoPress={() => alert("TODO: AGREGAR ALUMNO")}
                    onAsignarRubricaPress={() => {setAsignarMode('alumno'); onAsignarOpen();}} />
                </Tab>
                <Tab key="grupos" title="Grupos">
                    <GruposTable 
                        idCurso={params.idCurso} 
                        editable={true}
                        evaluable={esDocente}
                        removable={esDocente}
                        onEvaluarPress={(grupo) => {setEvaluarEntity(grupo); setEntityType('Grupo'); onEvaluarOpen();}}
                        onCrearGrupoPress={onGrupoOpen}
                        onEditarPress={(grupoId) => alert(`TODO: EDITAR grupoId: ${grupoId}`)} 
                        onAsignarRubricaPress={() => {setAsignarMode('grupo'); onAsignarOpen();}}
                        mutarDatos={mutateGrupos}/>
                </Tab>
            </Tabs>
            <CrearGrupoModal isOpen={isGrupoOpen} onOpenChange={onGrupoOpenChange} idCurso={params.idCurso} user={!esDocente ? session.user : undefined} onCrearGrupoSuccess={onCreateGrupoSuccess}/>
            {esDocente && 
                <AsignarRubricaModal mode={asignarMode} isOpen={isAsignarOpen} onOpenChange={onAsignarOpenChange} idCurso={params.idCurso} idUsuario={session.user.id}/>}
            {esDocente &&
                <EvaluarModal isOpen={isEvaluarOpen} onOpenChange={onEvaluarOpenChange} entity={evaluarEntity} idDocente={session.user.id} entityType={entityType} idCurso={params.idCurso}/>}
        </section>
    )
}