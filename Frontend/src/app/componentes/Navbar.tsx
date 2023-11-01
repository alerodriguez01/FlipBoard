"use client"

import { useRouter } from "next/navigation"

const Navbar = () => {

  const router = useRouter()

  const handleCerrarSesion = async () => {

    try {
      const usuario = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
      })

      if(usuario.ok) router.push("/")

  } catch (error) {
      console.log(error)
  }
  }

  return (
    <aside className="flex flex-col justify-center items-center border-[2px] p-2">
      <h1>FlipBoard nav lateral</h1>
      <button className="border-2 px-2 rounded" onClick={handleCerrarSesion}>Cerrar sesion</button>
    </aside>
  )
}

export default Navbar