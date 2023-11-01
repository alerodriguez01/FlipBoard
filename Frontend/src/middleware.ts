import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest, res: NextResponse) {

    // Si la ruta coincide con las rutas excluidas, pasa a la siguiente ruta
    if(matcherMiddleware(req.nextUrl.pathname)) return NextResponse.next() 

    console.log("¡Hola desde el middleware!")
    console.log(req.nextUrl.pathname)

    const isLoggedIn = req.cookies.get("token") ? true : false;

    if (isLoggedIn && req.nextUrl.pathname === "/") return NextResponse.redirect(new URL('/cursos', req.url));

    if (!isLoggedIn && req.nextUrl.pathname !== "/") return NextResponse.redirect(new URL("/", req.url));

};

// export const config = {
//         /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']

// };

const matcherMiddleware = (ruta: string) => {

    // Rutas a excluir
    const excludedRoutes = ["/_next/static", "/_next/image", "/favicon.ico", "/reset-password"];

    // Verifica si la ruta termina en .png o .svg o si la ruta coincide con las rutas excluidas
    return ruta.endsWith(".png") || ruta.endsWith(".svg") || excludedRoutes.some(route => ruta.startsWith(route))
}