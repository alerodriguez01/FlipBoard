'use client';
import EliminarModal from "@/app/componentes/ui/EliminarModal";
import ModificarUsuarioModal from "@/app/componentes/ui/ModificarUsuarioModal";
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { UsuariosTable } from "@/app/componentes/ui/UsuariosTable";
import endpoints from "@/lib/endpoints";
import { Usuario } from "@/lib/types";
import { toMayusFirstLetters } from "@/lib/utils";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";


export default function Usuarios() {
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const [usuarioSelected, setUsuarioSelected] = React.useState<Usuario>();
  const { isOpen: isEliminarOpen, onOpen: onEliminarOpen, onOpenChange: onEliminarOpenChange } = useDisclosure();
  const { isOpen: isModificar, onOpen: onModificarOpen, onOpenChange: onModificarOpenChange } = useDisclosure();
  const [mutateTableData, setMutateTableData] = React.useState(0);

  const onEliminarUsuario = async () => {

    if(!usuarioSelected) return false;

    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.deleteUsuario(usuarioSelected.id), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": session?.user.token || ''
        },
    });

    if (res.ok) {
      setMutateTableData(prev => prev + 1);
      return true;
    }
    return false;
  }
  
  if (status === 'loading' || !session)
    return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

  if (!session?.user?.superUser)
    router.replace(`/cursos`);

  return (
    <section className="p-8">
      <PagesHeader title="Usuarios de la plataforma" searchable={false}/>
      <UsuariosTable
        onEliminarPress={(user) => {setUsuarioSelected(user); onEliminarOpen();}}
        onModificarPress={(user) => {setUsuarioSelected(user); onModificarOpen();}}
        mutarDatos={mutateTableData}
        currentUserId={session?.user.id}
      />
      <EliminarModal isOpen={isEliminarOpen} onOpenChange={onEliminarOpenChange} type={'alumno'}
                        entityName={`a ${toMayusFirstLetters(usuarioSelected?.nombre ?? "")}`}
                        onEliminar={onEliminarUsuario} extraMessage="NOTA: Se eliminaran todos los datos asociados al usuario como Calificaciones, Rúbricas, etc. "
      />
      {usuarioSelected && 
        <ModificarUsuarioModal isOpen={isModificar} onOpenChange={onModificarOpenChange} user={usuarioSelected}/> }
    </section>
  );
}