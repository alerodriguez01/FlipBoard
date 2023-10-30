"use client"

export default function Home() {

  const handleClick = () => {
    fetch("http://localhost:3100/api/auth/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: "juanperez@gmail.com",
        contrasena: "Contra123456"
      })
    })
      .then((res: any) => res.json() )
      .then((data: any) => {
        console.log(data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-10">
      <h1>FlipBoard landing page con fomulario para login 😎</h1>
      <button onClick={handleClick}> Iniciar sesion</button>
    </main>
  )
}
