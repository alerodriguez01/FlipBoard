"use client"

import Link from "next/link"
import { Button, Divider } from "@nextui-org/react";
import { redirect, usePathname } from 'next/navigation'
import { signOut, useSession } from "next-auth/react";
import { Spinner as SpinnerNextUI } from "@nextui-org/react";


const Navbar = () => {

  const { data: session, status } = useSession(); // https://next-auth.js.org/getting-started/client#usesession

  const nombreUser = session?.user.nombre.split(" ").flatMap((word: string) => word[0].toUpperCase() + word.slice(1)).join(" ")

  const pathname = usePathname()
  const cursoId = pathname.split("/")[2] // si estoy en una ruta que no tiene cursoId, esto va a ser undefined

  const isDocente = session?.user.cursosDocente.includes(cursoId)

  const handleCerrarSesion = async () => {

    try {
      //https://next-auth.js.org/getting-started/client#signout
      signOut({
        redirect: true,
        callbackUrl: "/"
      }) // esto hace que se borre la cookie de sesion y se redirija a la pagina de logout

    } catch (error) {
      console.log("Error en navbar al cerrar sesion: ", error)
    }
  }

  return (
    <aside className="flex flex-col items-start justify-between p-6 bg-[#181e25] text-white dark:bg-[#0c0f11] shadow-lg shadow-slate-300 dark:shadow-slate-900 max-w-[15%] h-screen">

      <section className="flex flex-col w-full gap-3">

        <article className="flex flex-col items-center gap-2">
          <h1 className="font-semibold text-3xl">
            FlipBoard
          </h1>
          <Divider orientation="horizontal" className="bg-gray-600 mb-8" />

          {
            status === "loading" ?
              <SpinnerNextUI color="default" className="my-8" />
              :
              <>
                {session?.user.imagen ?
                  <img src={session?.user.imagen} alt="Imagen del usuario" className="w-20 h-20 rounded-full mb-1 shadow-md shadow-gray-600" />
                :
                <div className="flex items-center justify-center min-w-[80px] min-h-[80px] rounded-full border-2 bg-gray-800 shadow-md shadow-gray-600 mb-1">
                  <p className="text-2xl">
                    {(nombreUser?.split(" ").flatMap((word: string) => word[0]))}
                  </p>
                </div>}

                <h2 className="font-medium text-center">
                  {(nombreUser)}
                </h2>
                {pathname.startsWith('/cursos/') && !session?.user.superUser ?
                  <p className="text-gray-400">
                    {isDocente ? "Docente" : "Estudiante"}
                  </p>
                  :
                  session?.user.superUser ?
                    <p className="text-gray-400">Administrador</p> : <br/>
                }
                
              </>
          }

          <Divider orientation="horizontal" className="bg-gray-600 " />
        </article>

        <div className="flex flex-col mt-3 gap-1">
          <Link href="/cursos"
            className={`${pathname === '/cursos' ? "border-l-4 border-gray-600" : ""} p-3 text-sm hover:bg-gray-600 hover:bg-opacity-10`}
          >
            Mis cursos
          </Link>
          {pathname.startsWith('/cursos/') && // esto significa que estoy dentro de un curso
            <div className="flex flex-col ml-5">
              <Link
                href={`/cursos/${cursoId}/murales`}
                className={`${pathname.endsWith('/murales') ? "border-l-4 border-gray-600" : ""} p-3 text-sm hover:bg-gray-600 hover:bg-opacity-10`}
              >
                Ver murales
              </Link>
              <Link href={`/cursos/${cursoId}/participantes`}
                className={`${pathname.endsWith('/participantes') ? "border-l-4 border-gray-600" : ""} p-3 text-sm hover:bg-gray-600 hover:bg-opacity-10`}
              >
                Ver participantes
              </Link>
              <Link href={`/cursos/${cursoId}/calificaciones`}
                className={`${pathname.endsWith('/calificaciones') ? "border-l-4 border-gray-600" : ""} p-3 text-sm hover:bg-gray-600 hover:bg-opacity-10`}
              >
                Ver calificaciones
              </Link>
            </div>
          }
          <Link href="/rubricas"
            className={`${pathname === '/rubricas' ? "border-l-4 border-gray-600" : ""} p-3 text-sm hover:bg-gray-600 hover:bg-opacity-10`}
          >
            Mis rúbricas
          </Link>
        </div>

      </section>
      
      <footer className="flex flex-col gap-1 w-full">
        <Link href="/ayuda"
              className={`${pathname === '/ayuda' ? "border-l-4 border-gray-600" : ""} p-3 text-sm hover:bg-gray-600 hover:bg-opacity-10`}
            >
              Ayuda
        </Link>
        <div className="border-l-1 border-gray-600">
          <Button
            className="dark w-full flex justify-start rounded-none"
            onClick={handleCerrarSesion}
            variant="light"
          >
            Salir
          </Button>
        </div>
      </footer>
      

    </aside>
  )
}

export default Navbar