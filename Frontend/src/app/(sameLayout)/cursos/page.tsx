'use client';
import { CursoCard } from "@/app/componentes/ui/CursoCard";
import endpoints from "@/lib/endpoints";
import { Curso } from "@/lib/types";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from 'swr';

export default function Cursos() {

  const {data: session, status} = useSession();
  const {data, error, isLoading} = useSWR( session ? process.env.NEXT_PUBLIC_BACKEND_URL+endpoints.getUserWithCursos(session.user.id) : null, (url) => fetch(url).then(res => res.json()));
  let color = 0;

  if(error) return (<h1>{error.message}</h1>);

  return (
    status === 'loading' || isLoading ?
      <Spinner color="primary" size="lg" className="justify-center items-center h-full" />
    :
    <section className="flex flex-wrap overflow-auto items-center gap-6 p-8">
      {
        !data.cursosDocenteModel && !data.cursosAlumnoModel ? <h3>No hay cursos</h3> :
        <>
          <>{data.cursosDocenteModel ?
            data.cursosDocenteModel.map((c: Curso) => <CursoCard title={c.nombre} cursoId={c.id} color={color++%3} editable/>) : <></>}
          </>
          <>{data.cursosAlumnoModel ? 
            data.cursosAlumnoModel.map((c: Curso) => <CursoCard title={c.nombre} cursoId={c.id} color={color++%3}/>) : <></>}
          </>
        </>
      }
    </section>
  )
}