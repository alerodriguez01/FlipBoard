export default function Mural({ params }: { params: { idMural: string } }) {
    return (
        <main className="flex justify-center items-center h-screen">
            <section className="flex-1 h-full border-4 border-green-700 flex justify-center items-center">
                Excalidraw mural {params.idMural}
            </section>
            <aside className="flex-3 h-full p-20 border-4 border-yellow-600 flex justify-center items-center">
                Evaluar alumnos
            </aside>
        </main>
    )
}