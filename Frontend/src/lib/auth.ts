async function login(correo: string, contrasena: string) {

    const data = {
        correo,
        contrasena
    }

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL_CONTAINER + '/api/auth/login', {
            body: JSON.stringify(data),
            credentials: 'include', // para que el browser guarde la cookie del JWT
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        if (!res.ok) {
            //setError("erroresExternos", { message: "El correo y/o la contraseña son incorrectos." })
            return null
        }

        const userLogged = await res.json()
        //setUsuario(userLogged)
        //router.push("/cursos") // redirecciono a la pagina de cursos
        // reset()
        return userLogged

    } catch (error) {
        // Por ejemplo, el backend esta caido
        //setError("erroresExternos", { message: "Hubo un problema. Por favor, intente nuevamente." })
        return null
    }
    
}

export { login }