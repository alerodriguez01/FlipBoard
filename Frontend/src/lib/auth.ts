import endpoints from "./endpoints"
import { Usuario } from "./types"

async function login(correo: string, contrasena: string) {

    const data = {
        correo,
        contrasena
    }

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL_CONTAINER + endpoints.login(), {
            body: JSON.stringify(data),
            credentials: 'include', // para que el browser guarde la cookie del JWT
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        if (!res.ok) return null
        
        const userLogged = await res.json()
        return userLogged

    } catch (error) {
        // Por ejemplo, el backend esta caido
        return null
    }
    
}

async function loginProvider(provider: string, nombre: string, correo: string): Promise<Usuario | null>{

    const data = {
        nombre,
        correo
    }

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL_CONTAINER + endpoints.loginProvider(provider), {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        if (!res.ok) return null
        
        const userLogged = await res.json()
        return userLogged

    } catch (error) {
        // Por ejemplo, el backend esta caido
        return null
    }

}

export { login, loginProvider }