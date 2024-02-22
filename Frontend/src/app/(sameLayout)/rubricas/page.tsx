'use client'
import PagesHeader from "@/app/componentes/ui/PagesHeader";
import { RubricasAccordion } from "@/app/componentes/ui/RubricasAccordion";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";

export default function Rubricas() {

    const { data: session, status } = useSession();

    // fetch al backend para verificar si el usuario existe (puede que el superuser lo haya eliminado)
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getUserById(session?.user.id || ""),
        (url: string) => fetch(url, { headers: { "Authorization": session?.user.token || "" } }).then(res => res.json()));

    if (status === 'loading' || !session?.user)
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    if (!isLoading && data?.error) return (
        <section className="flex flex-col flex-1 p-8">
            <PagesHeader title="Rúbricas" searchable={false} />
            <h1 className="">No se pudieron obtener las rúbricas</h1>
        </section>
    );

    return (
        <section className="p-8 overflow-auto">
            <RubricasAccordion 
                endpoint={!!session.user.superUser ? endpoints.getAllRubricas() : endpoints.getAllRubricasFromUser(session.user.id)} 
                type={"editable"}
                searchable
                title={"Rúbricas"}
                userId={session?.user.id}
            />
            <Link href={'/rubricas/crear'} passHref>
                <Button
                    className="bg-[#181e25] text-white fixed bottom-10 right-10 dark:border dark:border-gray-700"
                    startContent={<PlusIcon color="#FFFFFF" />}
                    size="lg"> Crear nueva rúbrica </Button>
            </Link>

        </section>
    )
}