'use client';
import { MuralCard } from "@/app/componentes/ui/MuralCard";
import Link from "next/link";

export default function Murales({ params }: { params: { idCurso: string } }) {
  return (
    <section className="flex flex-wrap justify-center p-16 gap-5 overflow-auto">
      <MuralCard title={"Clase X- el mural de tometi"} color={1} editable muralId={""} />
      <MuralCard title={"Clase X- el mural de tometi 2"} color={2} muralId={""} rubrica="mi rubrica"/>
      <MuralCard title={"Clase X- el mural de tometi 3"} color={0} muralId={""} />
      <Link href="/cursos/murales/1" className="p-24 border">FlipBoard Mural 1</Link>
      <Link href="/cursos/murales/2" className="p-24 border">FlipBoard Mural 2</Link>
      <Link href="/cursos/murales/3" className="p-24 border">FlipBoard Mural 3</Link>
      <Link href="/cursos/murales/4" className="p-24 border">FlipBoard Mural 4</Link>
      <Link href="/cursos/murales/5" className="p-24 border">FlipBoard Mural 5</Link>
      <Link href="/cursos/murales/6" className="p-24 border">FlipBoard Mural 6</Link>
    </section>
  )
}