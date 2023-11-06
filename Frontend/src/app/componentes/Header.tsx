"use client"
import ButtonTheme from "@/app/componentes/ui/SwitchTheme"
import { usePathname } from "next/navigation"

const Header = () => {

    const pathname = usePathname()
    const isCursosOrRubricas = pathname === "/cursos" || pathname === "/rubricas"

    return (
        <header className="flex items-center bg-gray-300 dark:text-white dark:bg-gray-900 p-5 shadow-md shadow-slate-300 dark:shadow-slate-950">
            <h1 className="flex-1">FlipBoard header</h1>
            <ButtonTheme />
        </header>
    )
}

export default Header