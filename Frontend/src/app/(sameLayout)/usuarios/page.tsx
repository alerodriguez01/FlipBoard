'use client';
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { UsuariosTable } from "@/app/componentes/ui/UsuariosTable";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";


export default function Usuarios() {
  
  const { data: session, status } = useSession();
  
  if (status === 'loading')
    return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

  return (
    <section className="p-8">
      <PagesHeader title="Usuarios de la plataforma" searchable={false}/>
      <UsuariosTable/>
    </section>
  );
}