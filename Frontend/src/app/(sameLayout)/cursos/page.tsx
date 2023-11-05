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

  if(error) return (<h1>{error.message}</h1>);

  return (

    <section className=" bg-gray-300 flex flex-1 p-24 gap-5">
      {
        status === 'loading' || isLoading ? <Spinner color="default" className="my-8" /> :
        data.cursosDocenteModel.map((c: Curso) => <CursoCard title={c.nombre} color={Math.floor(Math.random()*3)} editable/>).concat(
          data.cursosAlumnoModel.map((c: Curso) => <CursoCard title={c.nombre} color={Math.floor(Math.random()*3)}/>)
        )
      }
    </section>
  )
}