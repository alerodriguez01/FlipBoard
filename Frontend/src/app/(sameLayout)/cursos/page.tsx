'use client';
import { CrearCursoModal } from "@/app/componentes/ui/CrearCursoModal";
import { CursoCard } from "@/app/componentes/ui/CursoCard";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { Curso } from "@/lib/types";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from 'swr';

export default function Cursos() {

  const { data: session, status } = useSession();
  const { data, error, isLoading, mutate } = useSWR(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getUserWithCursos(session.user.id) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;
  // para crear curso
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [search, setSearch] = useState("");

  const searchParams = useSearchParams();
  const [toastShowed, setToastShowed] = useState(false);
  // mostrar toast de error si luego de intentar ser agregado
  useEffect(() => {
    if (searchParams.get("invalidToken") === 'true' && !toastShowed) {
      toast.error('Hubo un error al añadirte al curso', { id: "invalidToken", position: "top-center", duration: 4000 }) // bug: se muestra muy rapido
      setToastShowed(true);
    }
  }, [])

  if (!isLoading && data?.error) return (
    <section className="flex flex-col flex-1 p-10">
      {/* {error.message} */}
      <h1 className="">No se pudieron obtener los cursos</h1>
    </section>
  );

  if (status === 'loading' || isLoading)
    return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

  return (
    <section className="flex flex-col overflow-auto gap-6 p-8">
      <Toaster />
      <PagesHeader title="Cursos" searchable={true} placeholder="Buscar curso" onSearch={(value: string) => setSearch(value)} />

      <div className="flex flex-wrap gap-6">
        {
          data.cursosDocenteModel.length === 0 && data.cursosAlumnoModel.length === 0 ?
            <h3>No hay cursos</h3>
            :
            <>
              {data.cursosDocenteModel.length > 0 &&
                data.cursosDocenteModel.map((c: Curso) => {
                  if (search !== "" && !c.nombre.toLowerCase().includes(search.toLowerCase())) return null;
                  return (<CursoCard key={crypto.randomUUID()} title={c.nombre} description={c.descripcion} cursoId={c.id} color={color++ % 2} editable />)
                })
              }
              {data.cursosAlumnoModel.length > 0 &&
                data.cursosAlumnoModel.map((c: Curso) => {
                  if (search !== "" && !c.nombre.toLowerCase().includes(search.toLowerCase())) return null;
                  return (<CursoCard key={crypto.randomUUID()} title={c.nombre} description={c.descripcion} cursoId={c.id} color={color++ % 2} />)
                })
              }
            </>
        }
      </div>

      <Button
        className="bg-[#181e25] text-white fixed bottom-10 right-10 z-10 dark:border dark:border-gray-700"
        startContent={<PlusIcon color="#FFFFFF" />}
        size="lg"
        onPress={onOpen}> Crear nuevo curso </Button>

      {!!session && (<CrearCursoModal isOpen={isOpen} onOpenChange={onOpenChange} onCrearCurso={mutate} idDocente={session.user.id} />)}

    </section>
  );
}