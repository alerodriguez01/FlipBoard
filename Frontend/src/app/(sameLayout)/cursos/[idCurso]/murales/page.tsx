'use client'
import { MuralCard } from "@/app/componentes/ui/MuralCard";
import endpoints from "@/lib/endpoints";
import { Mural } from "@/lib/types";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";

export default function Murales({ params }: { params: { idCurso: string } }) {

  const { data: session, status } = useSession();
  const { data, error, isLoading } = useSWR(session ? process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllMuralesWithRubricas(params.idCurso) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;

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
    <section className="flex flex-wrap overflow-auto items-center gap-6 p-8">
      {
        data.length < 1 ?
          <h3>No hay murales</h3>
          :
          data.map((m: Mural) =>
            <MuralCard
              key={crypto.randomUUID()}
              title={m.nombre}
              muralId={m.id}
              cursoId={params.idCurso}
              userId={session?.user.id || ""}
              room={m.contenido}
              rubrica={m.rubricaModel?.nombre}
              color={color++ % 3}
              editable={session?.user.cursosDocente.includes(m.cursoId)}
            />)

      }
    </section>
  )
}