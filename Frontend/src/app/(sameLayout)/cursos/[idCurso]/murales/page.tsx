'use client'
import { MuralCard } from "@/app/componentes/ui/MuralCard";
import endpoints from "@/lib/endpoints";
import { Mural } from "@/lib/types";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function Murales({ params }: { params: { idCurso: string } }) {
  
  const {data: session, status} = useSession();
  const {data, error, isLoading} = useSWR( session ? process.env.NEXT_PUBLIC_BACKEND_URL+endpoints.getAllMuralesWithRubricas(session.user.id) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;

  if(error) return (<h1>{error.message}</h1>);
  
  return (
    status === 'loading' || isLoading ?
      <Spinner color="primary" size="lg" className="justify-center items-center h-full" />
    :
    <section className="flex flex-wrap overflow-auto justify-center items-center gap-6 p-8">
      {
        data.map((m: Mural) => 
          <MuralCard title={m.nombre} muralId={m.id} rubrica={m.rubricaModel?.nombre} color={color++%3} editable={session?.user.cursosDocente.includes(m.cursoId)}/>)
      }
    </section>
  )
}