'use client'
import { AsignarRubricaModal } from "@/app/componentes/ui/AsignarRubricaModal";
import CrearModificarMuralModal from "@/app/componentes/ui/CrearModificarMuralModal";
import EliminarModal from "@/app/componentes/ui/EliminarModal";
import { MuralCard } from "@/app/componentes/ui/MuralCard";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { Curso, Mural, Rubrica } from "@/lib/types";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

export default function Murales({ params }: { params: { idCurso: string } }) {

  const { isOpen: isCrearOpen, onOpen: onCrearOpen, onOpenChange: onCrearOpenChange } = useDisclosure();

  const { data: session, status, update } = useSession();
  const isDocente = session?.user.cursosDocente.includes(params.idCurso)

  const { data: curso, error: errorCurso, isLoading: isLoadingCurso } = useSWR<Curso>(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getCursoById(params.idCurso) : null, (url: string) => fetch(url).then(res => res.json()));
  const { data, error, isLoading, mutate } = useSWR(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllMuralesWithRubricas(params.idCurso) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;

  const [selectedMural, setSelectedMural] = React.useState<Mural | undefined>();
  const { isOpen: isAsignarOpen, onOpen: onAsignarOpen, onOpenChange: onAsignarOpenChange } = useDisclosure();
  const { isOpen: isAsignarNewMuralOpen, onOpen: onAsignarNewMuralOpen, onOpenChange: onAsignarNewMuralOpenChange } = useDisclosure();
  const { isOpen: isEliminarOpen, onOpen: onEliminarOpen, onOpenChange: onEliminarOpenChange } = useDisclosure();
  const { isOpen: isModificarOpen, onOpen: onModificarOpen, onOpenChange: onModificarOpenChange } = useDisclosure();

  const [search, setSearch] = useState("");

  const [typeMuralModal, setTypeMuralModal] = useState<"crear" | "modificar">("crear");
  const [rubricaAsignadaNewMural, setRubricaAsignadaNewMural] = useState<Rubrica | null>(null); // rubrica que se asigna si se crea un nuevo mural
  useEffect(() => {
    if (rubricaAsignadaNewMural){
       if(typeMuralModal === "crear") onCrearOpen();
        else onModificarOpen();
    }
  }, [rubricaAsignadaNewMural])

  const searchParams = useSearchParams();

  // si en los search params viene updateCurso, entonces se actualiza la session (se viene de añadir un curso)
  if (session && searchParams.get("updateCurso") && !session.user.cursosAlumno.includes(params.idCurso)) {
    const cursosAlumno = session?.user.cursosAlumno || [];
    update({
      ...session,
      user: {
        ...session?.user,
        cursosAlumno: [...cursosAlumno, params.idCurso]
      }
    });
    // eliminar el parametro de los search params -> no se puede
  }

  // mostrar toast de bienvenida al curso luego de ser agregado
  useEffect(() => {
    if (session?.user.cursosAlumno.includes(searchParams.get("updateCurso") || ""))
      toast.success('¡Bienvenido al curso!', { id: "updateCurso", position: "top-center", duration: 4000 })
  }, [session?.user.cursosAlumno])

  // verifico si el curso al que quiere acceder, lo incluye como participante y actualizo su sesion
  // (porque puede pasar que este iniciado sesion, y lo agreguen a un curso. Si comparo solo con el estado de la sesion actual, no le permito ingresar, lo cual esta mal)
  if(!isLoadingCurso && curso && !session?.user.cursosAlumno.includes(params.idCurso)) {
    const cursosAlumno = session?.user.cursosAlumno || [];
    update({
      ...session,
      user: {
        ...session?.user,
        cursosAlumno: [...cursosAlumno, params.idCurso]
      }
    });
  }


  const onEliminarMural = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cursos/murales/${selectedMural?.id}?docente=${session?.user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      mutate()
      return true

    } else {
      return false
    }

  }

  if (error) return (
    <section className="flex flex-col flex-1 p-10">
      {/* {error.message} */}
      <h1 className="">No se pudieron obtener los murales</h1>
    </section>
  );

  if (status === 'loading' || isLoading)
    return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

  if (!session?.user.cursosAlumno.includes(params.idCurso) && !session?.user.cursosDocente.includes(params.idCurso)) {
    return (
      <section className="flex flex-col flex-1 justify-center items-center">
        <h1>No tienes acceso a este curso</h1>
        <Link href="/cursos" className="text-blue-600 hover:underline">Volver a cursos</Link>
      </section>
    )
  }

  if ((!isLoading && data?.error) || error) return (
    <section className="flex flex-col flex-1 p-10">
      {/* {error.message} */}
      <h1 className="">No se pudieron obtener los murales</h1>
    </section>
  );

  return (
    <section className="flex flex-col overflow-auto gap-6 p-8">
      <Toaster />
      <PagesHeader title="Murales" searchable={true} placeholder="Buscar mural" onSearch={(value: string) => setSearch(value)} />
      <div className="flex flex-wrap gap-6">
        {
          data.length < 1 ?
            <h3 className="px-3">El curso no posee murales creados</h3>
            :
            data.map((m: Mural) => {
              if (search !== "" && !m.nombre.toLowerCase().includes(search.toLowerCase())) return null;
              return (
                <MuralCard
                  key={crypto.randomUUID()}
                  title={m.nombre}
                  description={m.descripcion}
                  muralId={m.id}
                  cursoId={params.idCurso}
                  room={m.contenido}
                  rubrica={m.rubricaModel?.nombre}
                  color={color++ % 2}
                  editable={session?.user.cursosDocente.includes(m.cursoId)}
                  onAsignarPress={(id, nombre) => { setSelectedMural({ id, nombre } as Mural);  setTypeMuralModal("crear"); onAsignarOpen(); }}
                  onEliminarPress={(id, nombre) => { setSelectedMural({ id, nombre } as Mural); onEliminarOpen(); }}
                  onModificarPress={(id, nombre) => { setSelectedMural(m); setTypeMuralModal("modificar"); onModificarOpen(); }}
                />)
            })

        }
      </div>
      <AsignarRubricaModal
        idCurso={params.idCurso}
        isOpen={isAsignarOpen}
        onOpenChange={onAsignarOpenChange}
        mode="mural"
        idUsuario={session.user.id}
        mural={selectedMural}
        onRubricaAsignada={mutate}
      />

      <EliminarModal isOpen={isEliminarOpen} onOpenChange={onEliminarOpenChange} type="mural" entityName={selectedMural?.nombre || ""} onEliminar={onEliminarMural} />

      {isDocente &&
        <>
          <CrearModificarMuralModal
            isOpen={isCrearOpen}
            onOpenChange={onCrearOpenChange}
            mutateData={mutate}
            cursoId={params.idCurso}
            userId={session.user.id}
            openAsignarRubrica={onAsignarNewMuralOpen}
            rubrica={rubricaAsignadaNewMural}
            setRubrica={setRubricaAsignadaNewMural}
            type="crear"
          />
          <CrearModificarMuralModal
            isOpen={isModificarOpen}
            onOpenChange={onModificarOpenChange}
            mutateData={mutate}
            cursoId={params.idCurso}
            userId={session.user.id}
            openAsignarRubrica={onAsignarNewMuralOpen}
            rubrica={rubricaAsignadaNewMural ? rubricaAsignadaNewMural : selectedMural?.rubricaModel}
            setRubrica={setRubricaAsignadaNewMural}
            type="modificar"
            muralToModify={selectedMural}
          />
          <AsignarRubricaModal
            idCurso={params.idCurso}
            isOpen={isAsignarNewMuralOpen}
            onOpenChange={onAsignarNewMuralOpenChange}
            mode="newMural"
            idUsuario={session.user.id}
            onRubricaAsignadaNewMural={setRubricaAsignadaNewMural}
          />
          <Button
            className="bg-[#181e25] text-white fixed bottom-10 right-10 z-10 dark:border dark:border-gray-700"
            startContent={<PlusIcon color="#FFFFFF" />}
            size="lg"
            onPress={() => {onCrearOpen(); setTypeMuralModal("crear")}}> Crear nuevo mural </Button>
        </>
      }
    </section>
  )
}