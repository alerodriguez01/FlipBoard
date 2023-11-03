import Link from "next/link";

export default function Cursos() {
  return (
    <section className="flex flex-1 justify-center items-center p-24 gap-5">
      <Link href="/cursos/1/murales" className="p-24 border">FlipBoard Curso 1</Link>
      <Link href="/cursos/1/murales" className="p-24 border">FlipBoard Curso 2</Link>
      <Link href="/cursos/1/murales" className="p-24 border">FlipBoard Curso 3</Link>
      <Link href="/cursos/1/murales" className="p-24 border">FlipBoard Curso 4</Link>
    </section>
  )
}