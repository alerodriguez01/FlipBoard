"use client"
import { useUser } from "@/app/componentes/UserProvider"
import Image from "next/image"
import Link from "next/link"

export default function Login() {

  // const { usuario, setUsuario } = useUser()


  return (
    <section className="flex flex-col items-center gap-3 p-8 border border-black shadow-xl">
      <Image src="/flipboard-icon.png" alt="FlipBoard" width={100} height={100} />
      <h1 className="text-xl">Bienvenido</h1>
      <p className=" text-base text-center">Inicia sesión para continuar en la plataforma</p>
      <form className="flex flex-col gap-3 max-w-[250px]" action="">
        <label className="flex flex-col gap-1">
          <p className="text-sm">Correo electrónico</p>
          <input type="email" placeholder="flipboard@example.com" className="p-2 border-2 border-gray-200 rounded-md" required />
        </label>
        <label className="flex flex-col gap-1">
          <p className="text-sm">Contraseña</p>
          <input type="password" className="p-2 border-2 border-gray-200 rounded-md" required />
        </label>
        <Link href="#" className="text-blue-500 text-sm">¿Olvidaste tu contraseña?</Link>
        <button className="p-2 bg-blue-500 text-white rounded-md">Iniciar sesión</button>
      </form>
      <p className="text-sm">¿No tienes una cuenta? <Link href="#" className="text-blue-500">Regístrate</Link></p>
    </section>
  )
}
