import Image from "next/image"
import Login from "@/app/componentes/Login"

export default function Home() {

  return (
    <div className="flex h-[100dvh] md:h-screen items-center">
      <aside className="hidden sm:flex justify-center flex-[2]">
        <Image src="/bienvenido.png" alt="Bienvenido a FlipBoard" width={500} height={500} />
      </aside>
      <main className="flex-[1] p-5 md:p-20 flex justify-center items-center">
        <Login />
      </main>
    </div>
  )
}
