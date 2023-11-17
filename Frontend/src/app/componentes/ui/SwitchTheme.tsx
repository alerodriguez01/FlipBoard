"use client"
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import DarkLightIcon from "./icons/DarkLightIcon";


const SwitchTheme = () => {

    const { theme, setTheme } = useTheme();
    const currentTheme = theme === "dark" ? "dark" : "light"

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