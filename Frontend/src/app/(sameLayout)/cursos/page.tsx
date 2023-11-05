import { CursoCard } from "@/app/componentes/ui/CursoCard";
import Link from "next/link";

export default function Cursos() {
  return (
    <section className="flex flex-1 justify-center items-center p-24 gap-5">
      <CursoCard title="UN TITULO MUY LARGO PARA VER QUE PASAAAAAA" color={500} editable/>
      <CursoCard title="Este curso no es mio por eso no aparece el botoncito" color={500}/>
      <Link href="/cursos/1/murales" className="p-24 border">FlipBoard Curso 1</Link>
      <Link href="/cursos/2/murales" className="p-24 border">FlipBoard Curso 2</Link>
      <Link href="/cursos/3/murales" className="p-24 border">FlipBoard Curso 3</Link>
      <Link href="/cursos/4/murales" className="p-24 border">FlipBoard Curso 4</Link>
    </section>
  )
}