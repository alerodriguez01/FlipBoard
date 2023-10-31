"use client"
import { Usuario } from "@/lib/types"
import { createContext, useContext, useState } from "react"

export type UserContextType = {
    usuario: Usuario | null,
    setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>
}

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [usuario, setUsuario] = useState<Usuario | null>(null)

    return (
        <UserContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UserContext.Provider>
    )
}

// Hook para acceder al contexto
export function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser debe estar dentro de un UserProvider")
    return context
}

export default UserProvider