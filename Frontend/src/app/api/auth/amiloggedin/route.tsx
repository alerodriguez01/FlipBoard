import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req: NextRequest, res: NextResponse) {

    // get the session token from the request

    /* ---- Old but works ----*/
    // const sessionToken = req.cookies.get('next-auth.session-token')?.value || ''

    // // fetch the session from the backend
    // const session = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    //     headers: {
    //         cookie: `next-auth.session-token=${sessionToken}`
    //     }
    // })

    // const session = await session.json() // si no existe la session, retorna {}
    // const response = NextResponse.json({ loggedIn: Object.keys(session).length !== 0, ...session })
    /* -------------------- */
    const session = await getServerSession(authOptions)
    const response = NextResponse.json({ loggedIn: !!session, ...session })

    // add the CORS headers to the response
    response.headers.append('Access-Control-Allow-Credentials', "true")
    response.headers.append('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_MURAL_URL || "") 
    response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    response.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    return response
}