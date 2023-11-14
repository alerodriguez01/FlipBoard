import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    // get the session token from the request
    const sessionToken = req.cookies.get('next-auth.session-token')?.value || ''

    // fetch the session from the backend
    const session = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
        headers: {
            cookie: `next-auth.session-token=${sessionToken}`
        }
    })

    const sessionJson = await session.json() // si no existe la session, retorna {}

    const res = NextResponse.json({ loggedIn: Object.keys(sessionJson).length !== 0, ...sessionJson })
    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BACKEND_ROOM_URL || "") 
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    return res
}