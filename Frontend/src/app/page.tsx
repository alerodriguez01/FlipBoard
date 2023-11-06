import Image from "next/image"
import Login from "@/app/componentes/Login"

export default function Home() {

  return (
    <div className="flex h-[100dvh] md:h-screen items-center bg-white text-black light">
      <aside className="hidden sm:flex justify-center flex-[2] h-full">
        <Image src="/bienvenido.png" alt="Bienvenido a FlipBoard" width={500} height={500} className="object-contain"/>
      </aside>
      <main className="flex-[1] px-8 md:px-10 flex justify-center lg:items-center overflow-y-auto overflow-x-hidden h-full">
        <Login />
      </main>
    </div>
  )
}
