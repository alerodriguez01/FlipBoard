'use client'
import { RubricasAccordion } from "@/app/componentes/ui/RubricasAccordion";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Rubricas() {

    const { data: session, status } = useSession();
    const router = useRouter();    

    if (status === 'loading' || !session?.user)
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    return (
        <section className="m-5">
            <RubricasAccordion endpoint={endpoints.getAllRubricasFromUser(session.user.id)} type={"editable"} searchable title={"Rúbricas"} />
            <Link href={'/rubricas/crear'} passHref>
                <Button
                    className="bg-[#181e25] text-white fixed bottom-10 right-10"
                    startContent={<PlusIcon color="#FFFFFF" />}
                    size="lg"> Crear nueva rúbrica </Button>
            </Link>
            
        </section>
    )
}