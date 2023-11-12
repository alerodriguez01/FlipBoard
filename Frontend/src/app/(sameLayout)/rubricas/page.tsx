'use client'
import { RubricasAccordion } from "@/app/componentes/ui/RubricasAccordion";
import { PlusIcon } from "@/app/componentes/ui/icons/PlusIcon";
import endpoints from "@/lib/endpoints";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function Rubricas() {

    const { data: session, status } = useSession();    

    if (status === 'loading' || !session?.user)
        return <Spinner color="primary" size="lg" className="justify-center items-center h-full" />

    return (
        <section>
            <RubricasAccordion endpoint={endpoints.getAllRubricasFromUser(session.user.id)} type={"editable"} title={"Rúbricas"} />
            <Button
                className="bg-[#181e25] text-white fixed bottom-10 right-10"
                startContent={<PlusIcon color="#FFFFFF" />}
                size="lg"
                onPress={() => {alert("TODO: CREAR NUEVA RUBRICA")}}> Crear nueva rúbrica </Button>
        </section>
    )
}