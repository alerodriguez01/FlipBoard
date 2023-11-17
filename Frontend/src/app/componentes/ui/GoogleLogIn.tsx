"use client"
import { Button } from '@nextui-org/react'
import React from 'react'
import GoogleIcon from './icons/GoogleIcon'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export const GoogleLogIn = () => {

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/cursos"
    const backendError = searchParams.get("loginback")

    return (
        <>
            <Button
                className="w-full max-w-[250px] rounded-md p-2 hover:bg-gray-100"
                variant="bordered"
                startContent={<GoogleIcon />}
                onClick={() => signIn("google", { callbackUrl: callbackUrl })}
            >
                Continuar con Google
            </Button>
            {backendError && <p className="text-red-500 text-sm">Hubo un error al iniciar sesión. Intente nuevamente.</p>}
        </>
    )
}
