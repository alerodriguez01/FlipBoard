"use client"
import { useTheme } from "next-themes";
import { Button, button } from "@nextui-org/react";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";
import DarkLightIcon from "./icons/DarkLightIcon";


const SwitchTheme = () => {

    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    if(!currentTheme) return <button/> // esto lo hago para que no retorne un error en la consola

    return (
        <Button
            isIconOnly
            onClick={() => currentTheme === "dark" ? setTheme('light') : setTheme("dark")}
            variant="flat"
            className="rounded-full bg-transparent hover:text-gray-600 hover:dark:text-gray-400"
        >
            <DarkLightIcon theme={currentTheme} />
        </Button>
    );

}

export default SwitchTheme