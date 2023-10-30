import Header from "@/app/componentes/Header";
import Navbar from "@/app/componentes/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen max-h-screen">
      <Navbar />
      <section className="flex flex-col flex-1">
        <Header />
        {children}
      </section>
    </main>
  )
}