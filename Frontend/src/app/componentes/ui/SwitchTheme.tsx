"use client"
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";


const SwitchTheme = () => {

    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <Button
            isIconOnly
            onClick={() => currentTheme === "dark" ? setTheme('light') : setTheme("dark")}
            variant="flat"
        >
            {currentTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
    );

}

export default SwitchTheme