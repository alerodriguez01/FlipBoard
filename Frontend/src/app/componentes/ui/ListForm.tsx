import { Button, Input } from '@nextui-org/react';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { PersonAddIcon } from './icons/PersonAddIcon';
import { useTheme } from 'next-themes';
import { CrossIcon } from './icons/CrossIcon';

type ListFormProps = {
    title: string,
    inputPlacholder: string,
    buttonMessage: string,
    buttonMessageOk: string,
    buttonMessageError: string,
    onSubmitForm: (items: string[]) => Promise<Response>,
    resetState: boolean
}


const ListForm = ({ title, inputPlacholder, buttonMessage, buttonMessageOk, buttonMessageError, onSubmitForm, resetState }: ListFormProps) => {

    const { theme, systemTheme, setTheme } = useTheme()
    const currentTheme = theme === "system" ? systemTheme : theme

    const [items, setItems] = useState<string[]>([])
    const [itemInput, setItemInput] = useState('');

    const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (itemInput === '') return;
        if (items.includes(itemInput)) return;
        setItems([...items, itemInput]);
        setItemInput('');
    }

    const [itemsSent, setItemsSent] = useState(false)
    const [itemLoading, setItemLoading] = useState(false)

    const [error, setError] = useState(false)

    const handleOnClick = async () => {

        setError(false)
        setItemLoading(true)
        try {
            const res = await onSubmitForm(items)
            if (res.ok) setItemsSent(true)
            else setError(true)
        } catch (error) {
            setError(true)
        }
        setItemLoading(false)
    }

    const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setItemsSent(false)
        setItemInput(e.target.value)
    }

    useEffect(() => {
        setItems([])
        setItemInput('')
        setItemsSent(false)
        setError(false)
    }, [resetState])

    return (
        <article className="flex flex-col gap-2">
            <h2>{title}</h2>
            <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                    variant="bordered"
                    type="email"
                    placeholder={inputPlacholder}
                    value={itemInput}
                    onChange={handleInputOnChange}
                />
                <Button
                    variant="ghost"
                    isIconOnly
                    type="submit"
                >
                    <PersonAddIcon theme={currentTheme ?? 'light'} />
                </Button>
            </form>
            {items.map((item) => (
                <div key={item} className="flex gap-2 w-full justify-between items-center px-2">
                    <p key={item}>{item}</p>
                    <Button
                        variant="light"
                        isIconOnly
                        onClick={() => setItems(items.filter((i) => i !== item))}
                    >
                        <CrossIcon />
                    </Button>
                </div>
            ))}
            {items.length > 0 &&
                <>
                    <Button
                        variant="flat"
                        onClick={handleOnClick}
                        isLoading={itemLoading}
                        className={itemsSent ? "bg-green-100 dark:bg-green-700" : ""}
                    >
                        {itemsSent ? buttonMessageOk : buttonMessage}
                    </Button>
                    {error && <p className="text-red-500 text-sm">{buttonMessageError}</p>}
                </>
            }
        </article>
    )
}

export default ListForm