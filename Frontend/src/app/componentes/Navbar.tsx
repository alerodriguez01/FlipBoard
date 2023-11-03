"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button, Divider } from "@nextui-org/react";
import { useUser } from "./providers/UserProvider";
import { usePathname } from 'next/navigation'

const Navbar = () => {

  const { usuario, setUsuario } = useUser()
  const nombreUser = usuario?.nombre.split(" ").flatMap((word: string) => word[0].toUpperCase() + word.slice(1)).join(" ")

  const router = useRouter()
  const pathname = usePathname()
  const cursoId = pathname.split("/")[2] // si estoy en una ruta que no tiene cursoId, esto va a ser undefined

  const handleCerrarSesion = async () => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (res.ok) router.push("/")

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <aside className="flex flex-col items-start justify-between p-6 bg-[#181e25] text-white dark:bg-[#0c0f11] shadow-lg shadow-slate-300 dark:shadow-slate-900 max-w-[15%]">

      <section className="flex flex-col w-full gap-3">

        <article className="flex flex-col items-center gap-2">
          <h1 className="font-semibold text-3xl">
            FlipBoard
          </h1>
          <Divider orientation="horizontal" className="bg-gray-600 mb-8" />

          {/* Imagen con iniciales del usuario*/}
          <div className="flex items-center justify-center min-w-[80px] min-h-[80px] rounded-full border-2 bg-gray-800 shadow-md shadow-gray-600 mb-1">
            <p className="text-2xl">
              {(nombreUser?.split(" ").flatMap((word: string) => word[0]))}
            </p>
          </div>

          <h2 className="font-medium text-center">
            {(nombreUser)}
          </h2>
          {pathname.endsWith('/murales') ?
            <p className="text-gray-400">
              Estudiante
            </p>
            :
            <br />
          }
          <Divider orientation="horizontal" className="bg-gray-600 " />
        </article>

        <div className="flex flex-col mt-3 gap-1">
          <Link href="/cursos" className={pathname === '/cursos' ? "border-l-4 border-gray-600" : ""}>
            <Button
              className="dark w-full flex justify-start rounded-none"
              variant="light"
            >
              Mis cursos
            </Button>
          </Link>
          {pathname.startsWith('/cursos/') && // esto significa que estoy dentro de un curso
            <div className="flex flex-col ml-5">
              <Link href={`/cursos/${cursoId}/murales`} className={pathname.endsWith('/murales') ? "border-l-4 border-gray-600" : ""}>
                <Button
                  className="dark w-full flex justify-start rounded-none"
                  variant="light"
                >
                  Ver murales
                </Button>
              </Link>
              <Link href={`/cursos/${cursoId}/participantes`} className={pathname.endsWith('/participantes') ? "border-l-4 border-gray-600" : ""}>
                <Button
                  className="dark w-full flex justify-start rounded-none"
                  variant="light"
                >
                  Ver participantes
                </Button>
              </Link>
              <Link href={`/cursos/${cursoId}/calificaciones`} className={pathname.endsWith('/calificaciones') ? "border-l-4 border-gray-600" : ""}>
                <Button
                  className="dark w-full flex justify-start rounded-none"
                  variant="light"
                >
                  Ver calificaciones
                </Button>
              </Link>
            </div>
          }
          <Link href="/rubricas" className={pathname === '/rubricas' ? "border-l-4 border-gray-600" : ""}>
            <Button
              className="dark w-full flex justify-start rounded-none"
              variant="light"
            >
              Mis rúbricas
            </Button>
          </Link>
        </div>

      </section>

      <div className="border-l-1 border-gray-600 w-full">
        <Button
          className="dark w-full flex justify-start rounded-none"
          onClick={handleCerrarSesion}
          variant="light"
        >
          Salir
        </Button>
      </div>

    </aside>
  )
}

export default Navbar