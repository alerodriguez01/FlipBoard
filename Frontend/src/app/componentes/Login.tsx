"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import SignUp from "@/app/componentes/SignUp"
import SignIn from "@/app/componentes/SignIn"


export default function Login() {

  const [registro, setRegistro] = useState(false)

  return (
    <section className="flex flex-col items-center gap-3 p-8 border-2 border-gray-700 shadow-md dark:shadow-gray-700 rounded h-fit my-5">
      <Image src="/flipboard-icon.png" alt="FlipBoard" width={100} height={100} />
      <h1 className="text-xl">¡Bienvenido!</h1>
      <p className=" text-base text-center">{registro ? "Regístrate" : "Inicia sesión"} para continuar en la plataforma</p>
      {registro ?
        <>
          <SignUp />
          <p className="text-sm">¿Ya tienes una cuenta? <button onClick={() => setRegistro(false)} className="text-blue-500">Inicia sesión</button></p>
        </>
        :
        <>
          <SignIn />
          <p className="text-sm">¿No tienes una cuenta? <button onClick={() => setRegistro(true)} className="text-blue-500">Regístrate</button></p>
        </>
      }
    </section>
  )
}
