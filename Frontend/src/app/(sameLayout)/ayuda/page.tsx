import PagesHeader from "@/app/componentes/ui/PagesHeader"

export default function Ayuda() {
    return (
        <section className="flex flex-col overflow-auto p-8">
            
            <PagesHeader title="Ayuda" searchable={false} />
            
            <section className="flex flex-row h-screen">
                <article className="w-[80%]">
                    Todo: Contenido
                </article>
                <aside className="w-[20%]">
                    Todo: Indice
                </aside>
            </section>
        </section>
    );
}