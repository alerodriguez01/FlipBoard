"use client"
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import DarkLightIcon from "./icons/DarkLightIcon";
import { useEffect, useState } from "react";


const SwitchTheme = () => {

    // https://www.npmjs.com/package/next-themes#avoid-hydration-mismatch
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const currentTheme = theme === "dark" ? "dark" : "light"


    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

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