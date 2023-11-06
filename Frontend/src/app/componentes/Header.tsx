import ButtonTheme from "@/app/componentes/ui/SwitchTheme"

const Header = () => {
    return (
        <header className="flex justify-between items-center bg-gray-300 dark:text-white dark:bg-gray-900 p-10 shadow-md shadow-slate-300 dark:shadow-slate-950">
            <h1>FlipBoard header</h1>
            <ButtonTheme />
        </header>
    )
}

export default Header