import Link from "next/link";

export default function Murales({ params }: { params: { idCurso: string } }) {
  return (
    <section className="flex flex-wrap justify-center p-16 gap-5 overflow-auto">
      <Link href="/cursos/1/murales/1" className="p-24 border">FlipBoard Mural 1</Link>
      <Link href="/cursos/1/murales/2" className="p-24 border">FlipBoard Mural 2</Link>
      <Link href="/cursos/1/murales/3" className="p-24 border">FlipBoard Mural 3</Link>
      <Link href="/cursos/1/murales/4" className="p-24 border">FlipBoard Mural 4</Link>
      <Link href="/cursos/1/murales/5" className="p-24 border">FlipBoard Mural 5</Link>
      <Link href="/cursos/1/murales/6" className="p-24 border">FlipBoard Mural 6</Link>
      <Link href="/cursos/1/murales/7" className="p-24 border">FlipBoard Mural 7</Link>
      <Link href="/cursos/1/murales/8" className="p-24 border">FlipBoard Mural 8</Link>
      <Link href="/cursos/1/murales/9" className="p-24 border">FlipBoard Mural 9</Link>
    </section>
  )
}