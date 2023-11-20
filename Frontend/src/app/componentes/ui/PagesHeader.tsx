"use client"
import { Input } from "@nextui-org/react"
import { SearchIcon } from "./icons/SearchIcon"
import { useTheme } from "next-themes"

type PagesHeaderProps = {
    title: string,
    placeholder?: string,
    searchable: boolean,
    onSearch?: (value: string) => void
}

const PagesHeader = ({title, placeholder, searchable, onSearch}: PagesHeaderProps) => {

    const {theme} = useTheme();
    const currentTheme = theme === "dark" ? "dark" : "light";

    return (
        <header className="flex flex-row justify-between mb-4 mx-2.5">
            <h1 className="text-2xl font-semibold self-center">{title}</h1>
            {searchable &&
                <Input
                    radius="none"
                    variant="underlined"
                    size="lg"
                    placeholder={placeholder}
                    startContent={<SearchIcon theme={currentTheme} />}
                    className="w-96"
                    onValueChange={onSearch} />
            }
        </header>
    )
}

export default PagesHeader