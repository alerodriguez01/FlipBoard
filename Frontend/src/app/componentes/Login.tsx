"use client"
import Image from "next/image"
import Link from "next/link"
import SignUp from "@/app/componentes/SignUp"
import SignIn from "@/app/componentes/SignIn"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Divider, Spinner as SpinnerNextUI } from "@nextui-org/react";
import { useEffect } from "react"
import { GoogleLogIn } from "./ui/GoogleLogIn"

export default function Login() {

  const { data: session, status } = useSession()

  const router = useRouter()

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/cursos"

  const getURLWithCallBackAndSearchParam = (name: string, value: string) => {
    const newSearchParams = new URLSearchParams()
    if(searchParams.get("callbackUrl")) newSearchParams.set("callbackUrl", callbackUrl)
    newSearchParams.set(name, value)
    return "/?" + newSearchParams.toString()
  }

  const sessionHasExpired = () => {

    if(session) {
      const timeExpires = new Date(session.expires)
      const timeNow = new Date()
      // si la session expiro, recargo la pagina
      if (timeExpires < timeNow) {
        window.location.reload() // recargo la pagina, se actualiza la session y queda como null
        return true
      }
      return false
    }

    return true
  }

  // Si ya esta logueado, redirijo a la pagina que me pasaron por parametro o a la pagina de cursos
  if (session) router.push(callbackUrl)

  // useEffect que se ejecuta cuando se renderiza el componente y que tiene como dependencia a status. 
  // Si pasan mas de 5 segundos y el status es authenticated, recargo la pagina.
  // Es la unica manera de solucionar un bug de nextauth. https://github.com/alerodriguez01/FlipBoard/issues/197 
  // A otros le paso lo mismo: https://github.com/nextauthjs/next-auth/issues/8424 y no encontraron solucion.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'authenticated') window.location.reload()
    }, 5000)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <section className={"flex flex-col items-center gap-3 p-8 h-fit my-5" + (status === 'unauthenticated' || sessionHasExpired() ? " border-2 border-gray-700 shadow-md shadow-gray-400 rounded" : "")}>
      <Image src="/flipboard-icon.png" alt="FlipBoard" width={100} height={100} />
      <h1 className="text-xl">¡Bienvenido!</h1>
      {
        (status === 'loading' || status === 'authenticated') && !sessionHasExpired() ?
          <SpinnerNextUI />
          :
          <>
            <p className=" text-base text-center">{searchParams.get("registro") ? "Regístrate" : "Inicia sesión"} para continuar en la plataforma</p>
            {searchParams.get("registro") ?
              <>
                <SignUp />
                <p className="text-sm">¿Ya tienes una cuenta? <Link href={searchParams.get("callbackUrl") ?? '/'} className="text-blue-500">Inicia sesión</Link></p>
              </>
              :
              <>
                <SignIn />
                <p className="text-sm">¿No tienes una cuenta? <Link href={getURLWithCallBackAndSearchParam("registro", "true")} className="text-blue-500">Regístrate</Link></p>
                <div className="flex items-center justify-center gap-2 w-max-[250px]">
                  <Divider className="w-28" /> ó <Divider className="w-28" />
                </div>
                <GoogleLogIn />
              </>
            }
          </>
      }
    </section>
  )
}
