'use client';
import { CrearCursoModal } from "@/app/componentes/CrearCursoModal";
import { CursoCard } from "@/app/componentes/ui/CursoCard";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { Curso } from "@/lib/types";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import useSWR from 'swr';

export default function Cursos() {

  const { data: session, status } = useSession();
  const { data, error, isLoading, mutate } = useSWR(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getUserWithCursos(session.user.id) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;
  // para crear curso
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(data)

  if (error) return (<h1>{error.message}</h1>);

  if (status === 'loading' || isLoading)
    return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

  return (
    <section className="flex flex-wrap overflow-auto items-center gap-6 p-8">
      {
        data.cursosDocenteModel.length === 0 && data.cursosAlumnoModel.length === 0 ?
          <h3>No hay cursos</h3>
          :
          <>
            {data.cursosDocenteModel.length > 0 &&
              data.cursosDocenteModel.map((c: Curso) => <CursoCard title={c.nombre} cursoId={c.id} color={color++ % 3} editable />)
            }
            {data.cursosAlumnoModel.length > 0 &&
              data.cursosAlumnoModel.map((c: Curso) => <CursoCard title={c.nombre} cursoId={c.id} color={color++ % 3} />)
            }
          </>
      }

      <Button
        className="bg-[#181e25] text-white fixed bottom-10 right-10"
        startContent={<PlusIcon color="#FFFFFF" />}
        size="lg"
        onPress={onOpen}> Crear nuevo curso </Button>

      {!!session && (<CrearCursoModal isOpen={isOpen} onOpenChange={onOpenChange} onCrearCurso={mutate} idDocente={session.user.id} />)}

    </section>
  );
}