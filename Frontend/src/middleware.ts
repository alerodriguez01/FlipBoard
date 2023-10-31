import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest, res: NextResponse) {

    console.log("hola desde el middleware!")

    const isLoggedIn = req.cookies.get("token") ? true : false;

    // if (isLoggedIn && req.nextUrl.pathname === "/") return NextResponse.redirect(new URL('/cursos', req.url));
    
    // if (!isLoggedIn && req.nextUrl.pathname !== "/") return NextResponse.redirect(new URL("/", req.url));

};

export const config = {
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] 

};