const ResetPassword = ({ params }: { params: { token: string, idUsuario: string } }) => {

// Good luck bro 🫡

return (
    <main>
        <h1>Usuario: {params.idUsuario}</h1>
        <p>Token: {params.token}</p>
        {/*
            VIDEO OBLIGATORIO A VER COMPLETO PARA EL MANEJO DE FORMS:
            - https://www.youtube.com/watch?v=u6PQ5xZAv7Q&ab_channel=ByteGrad
            y ver tamb como se hizo el login
        */}
        <form action="">
            <label>
                Nueva contraseña
                <input className="border-2" type="password" />
            </label>
            <label>
                Repetir contraseña
                <input className="border-2" type="password" />
            </label>
            <button className="border-2 text-blue-500 text-sm">Actualizar contraseña</button>
        </form>
    </main>
)
}

export default ResetPassword