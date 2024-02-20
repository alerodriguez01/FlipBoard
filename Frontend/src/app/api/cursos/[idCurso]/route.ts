import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

type PayloadJWTAnadirCurso = {
    idDocente: string,
    idCurso: string
}
/*
    GET /api/cursos/[idCurso]?token=12d3..&idAlumno=1ds4..
 */
export async function GET(req: NextRequest, { params: { idCurso } }: { params: { idCurso: string } }) {

    const searchParams = req.nextUrl.searchParams
    const token = searchParams.get("token") || ""

    // obtener idAlumno a partir de la sesion
    const session = await getServerSession(authOptions)
    const idAlumno = session?.user.id ?? ""

    // 1. Verficar JWT
    try {
        const decoded = jwt.verify(token, process.env.SHARE_CURSO_JWT_KEY ?? "") as PayloadJWTAnadirCurso
        if (decoded.idCurso !== idCurso) throw new Error()

        // 2. Agregar alumno al curso
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cursos/${idCurso}/alumnos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": session?.user.token || ''
            },
            body: JSON.stringify({ id: idAlumno }),
        })

        if (!res.ok) throw new Error()

        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/cursos/${idCurso}/murales?updateCurso=${idCurso}`, req.url))

    } catch (error) {
        // token invalido
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/cursos?invalidToken=true`, req.url))
    }


}