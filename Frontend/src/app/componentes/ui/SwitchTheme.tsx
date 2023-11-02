"use client"
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";


const SwitchTheme = () => {

    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <Switch
            defaultSelected={currentTheme === "light"}
            size="lg"
            color="primary"
            thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                    <SunIcon className={className} />
                ) : (
                    <MoonIcon className={className} />
                )
            }
            onClick={() => currentTheme === "dark" ? setTheme('light') : setTheme("dark")}
        />
    );

}

export default SwitchTheme