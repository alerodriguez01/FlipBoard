'use client'
import { MuralCard } from "@/app/componentes/ui/MuralCard";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import endpoints from "@/lib/endpoints";
import { Mural } from "@/lib/types";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

export default function Murales({ params }: { params: { idCurso: string } }) {

  const { data: session, status, update } = useSession();
  const { data, error, isLoading } = useSWR(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllMuralesWithRubricas(params.idCurso) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;

  const [search, setSearch] = useState("");

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

  return (
    <section className="flex flex-col overflow-auto gap-6 p-8">
      <Toaster />
      <PagesHeader title="Murales" searchable={true} placeholder="Buscar mural" onSearch={(value: string) => setSearch(value)} />
      <div className="flex flex-wrap gap-6">
        {
          data.length < 1 ?
            <h3>No hay murales</h3>
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
                />)
            })

        }
      </div>
    </section>
  )
}