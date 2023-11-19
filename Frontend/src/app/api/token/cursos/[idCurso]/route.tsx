import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

type PayloadJWTAnadirCurso = {
    idDocente: string,
    idCurso: string
}

// Generate JWT with idDocente and idCurso
/*
    POST /api/token/cursos/[idCurso]
    Body: { idDocente: string }
    Response: { token: string }
 */
export async function POST(req: NextRequest, { params }: { params: { idCurso: string } }) {

    const { idDocente } = await req.json()

    const token = jwt.sign({ idDocente, idCurso: params.idCurso }, process.env.SHARE_CURSO_JWT_KEY ?? "", { expiresIn: "7d" })

    return NextResponse.json({ token })
}